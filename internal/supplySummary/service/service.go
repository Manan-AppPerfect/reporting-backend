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
		contracted int
		delivered  int
	})

	var keys []string
	keyIndex := make(map[string]int)

	for _, d := range data {

		key := getAggregationKey(d.Date, string(req.Aggregation))

		val := grouped[key]
		val.contracted += d.Contracted
		val.delivered += d.Delivered
		grouped[key] = val

		if _, exists := keyIndex[key]; !exists {
			keyIndex[key] = len(keys)
			keys = append(keys, key)
		}
	}

	var chart []api.ChartData
	
	for _, k := range keys {

		v := grouped[k]

		parsedTime, _ := time.Parse("2006-01-02", k)

		chart = append(chart, api.ChartData{
			Date: types.Date{Time: parsedTime},
			Contracted: v.contracted,
			Delivered:  v.delivered,
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