package service

import (
	"reporting-backend/internal/supplySummary/persistence"
	api "reporting-backend/internal/supplySummary/server"
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

	

}