package service

import (
	"fmt"
	"reporting-backend/internal/supplySummary/persistence"
	api "reporting-backend/internal/supplySummary/server"
	"time"

	"github.com/oapi-codegen/runtime/types"
)

type Service struct {
	repo *persistence.Repository
}

func NewService(repo *persistence.Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetReporting(req api.ReportingRequest) (api.ReportingResponse, error) {

	data, err := s.repo.GetData(req)
	if err != nil {
		return api.ReportingResponse{}, err
	}

	grouped := make(map[string]struct {
		contracted 	int
		delivered  	int
		csp			string
		gpuType		string
		date		time.Time
	})

	var keys []string
	keyIndex := make(map[string]int)

	for _, d := range data {

		dateKey := getAggregationKey(d.Date, string(req.Aggregation))

		key := fmt.Sprintf("%s_%s_%s", dateKey, d.Csp, d.GpuType)

		val := grouped[key]
		val.contracted += d.Contracted
		val.delivered += d.Delivered
		val.csp = d.Csp
		val.gpuType = d.GpuType
		val.date = d.Date

		grouped[key] = val

		if _, exists := keyIndex[key]; !exists {
			keyIndex[key] = len(keys)
			keys = append(keys, key)
		}
	}

	var chart []api.ChartData
	
	for _, v := range grouped {

		date := types.Date{Time: v.date}
		c := v.contracted
		d := v.delivered
		csp := v.csp
		gpu := v.gpuType

		chart = append(chart, api.ChartData{
			Date:       date,
			Contracted: c,
			Delivered:  d,
			Csp:        &csp,     
			GpuType:    &gpu,    
		})
	}

	contractedMap := make(map[string]int)
	deliveredMap := make(map[string]int)

	for _, k := range keys {
		v := grouped[k]

		contractedMap[k] = v.contracted
		deliveredMap[k] = v.delivered
	}

	row1 := "Total Contracted GPUs - Contracted Delivery"
	row2 := "Total Contracted GPUs - Delivered & Expected"

	table := api.TableData{
		Rows: &[]api.TableRow{
			{
				Category: &row1,
				Data:     &contractedMap,
			},
			{
				Category: &row2,
				Data:     &deliveredMap,
			},
		},
	}

	return api.ReportingResponse{
		Chart: &chart,
		Table: &table,
	}, nil
}


func getAggregationKey(t time.Time, agg string) string {

	switch agg {

	case "daily":
		return t.Format("2006-01-02")

	case "weekly":
		year, week := t.ISOWeek()
		return fmt.Sprintf("%d-W%02d", year, week)

	case "monthly":
		return t.Format("2006-01-01")

	default:
		return t.Format("2006-01-01")
	}
}