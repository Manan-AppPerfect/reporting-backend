package handler

import (
	api "reporting-backend/internal/supplySummary/server"
	"reporting-backend/internal/supplySummary/service"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *service.Service
}

func NewHandler(s *service.Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) PostReporting(c *gin.Context) {
	var req api.ReportingRequest

	// 🔥 Now required for POST
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	data, err := h.service.GetReporting(req)
	if err != nil {
		c.JSON(500, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, data)
}