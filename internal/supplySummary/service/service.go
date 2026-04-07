package service

import (
	"fmt"
	"reporting-backend/internal/supplySummary/persistence"
	api "reporting-backend/internal/supplySummary/server"
	"sort"
	"time"

	"github.com/oapi-codegen/runtime/types"
)

type Service struct {
	repo *persistence.Repository
}

func NewService(repo *persistence.Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetReporting (req api.ReportingRequest) (api.ReportingResponse, error) {

	// fetching data from repo
	data, err := s.repo.GetData(req)
	if err != nil {
		return api.ReportingResponse{}, err
	}

	// chart map

	chartMap := make(map[string]struct {
		Contracted 	int
		Delivered  	int
		Date		time.Time
	})

	for _, d := range data {

		dateKey := getAggregationKey(d.Date, string(req.Aggregation)) 

		val := chartMap[dateKey]
		val.Contracted += d.Contracted
		val.Delivered += d.Delivered
		val.Date = d.Date

		chartMap[dateKey] = val
	}

	var chart []api.ChartData

	for _, v := range chartMap {

		date := types.Date{Time: v.Date}
		c := v.Contracted
		d := v.Delivered

		chart = append(chart, api.ChartData{
			Date:       date,
			Contracted: c,
			Delivered:  d,
		})
	}

	// table map (total data + grouped(csp + gpu) + segregation metrics(contracted and delivered ))

	totalContracted := make(map[string]int)
	totalDelivered := make(map[string]int)

	groupContracted := make(map[string]map[string]int) 
	groupDelivered := make(map[string]map[string]int)

	for _, d := range data {

		dateKey := getAggregationKey(d.Date, string(req.Aggregation))
		
		// total

		totalContracted[dateKey] += d.Contracted
		totalDelivered[dateKey] += d.Delivered

		// grouped (csp+gpu)

		groupKey := fmt.Sprintf("%s: %s", d.Csp, d.GpuType)

		if groupContracted[groupKey] == nil {
			groupContracted[groupKey] = make(map[string]int)
		}
		if groupDelivered[groupKey] == nil {
			groupDelivered[groupKey] = make(map[string]int)
		}

		groupContracted[groupKey][dateKey] += d.Contracted
		groupDelivered[groupKey][dateKey] += d.Delivered
	}

	var rows []api.TableRow

	// total rows

	cat1 := "Total Contracted GPUs - Contracted Delivery"
	cat2 := "Total Contracted GPUs - Delivered & Expected"

	rows = append(rows, api.TableRow{
		Category: &cat1,
		Data:     &totalContracted,
	})

	rows = append(rows, api.TableRow{
		Category: &cat2,
		Data:     &totalDelivered,
	})

	for key := range groupContracted {

		// contracted 
		catC := fmt.Sprintf("%s - Contracted Delivery", key)

		dataC := groupContracted[key]
		rows = append(rows, api.TableRow{
			Category: &catC,
			Data: &dataC,
		})

		// delivered
		catD := fmt.Sprintf("%s - Delivery & Expected", key)

		dataD := groupDelivered[key]
		rows = append(rows, api.TableRow{
			Category: &catD,
			Data: &dataD,
		})

	}
	sort.Slice(rows, func(i, j int) bool {
		return *rows[i].Category < *rows[j].Category
	})

	return api.ReportingResponse{
		Chart: &chart,
		Table: &api.TableData{
			Rows: &rows,
		},
	}, nil

}

func getAggregationKey(date time.Time, aggregation string) string {

	switch aggregation {

	case "daily":
		return date.Format("2006-01-02")
		
	case "monthly":
		monthStart := time.Date(
			date.Year(),
			date.Month(),
			1,
			0,0,0,0,
			time.UTC,
		)
		return monthStart.Format("2006-01-02")

	case "yearly":
		yearStart := time.Date(
			date.Year(),
			1,
			1,
			0,0,0,0,
			time.UTC,
		)
		return yearStart.Format("2006-01-02")

	default:
		// fallback → treat as daily
		return date.Format("2006-01-02")
	}
}