package persistence

import (
	"reporting-backend/internal/supplySummary/model"
	api "reporting-backend/internal/supplySummary/server"

	"gorm.io/gorm"
)

type Repository struct {
	Persistence *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{Persistence: db}
}

func (r *Repository) GetData(req api.ReportingRequest) ([]model.Capacity, error) {

	var data []model.Capacity

	query := r.Persistence.Model(&model.Capacity{})

	startDate := req.StartDate.Time
	endDate := req.EndDate.Time

	query = query.Where("date >= ? AND date <= ?", startDate, endDate)

	query = query.Order("date ASC")

	if err := query.Find(&data).Error; err != nil {
		return nil, err
	}

	return data, nil
}