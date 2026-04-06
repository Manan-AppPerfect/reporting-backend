package main

import (
	"reporting-backend/internal/db"
	supplysummary "reporting-backend/internal/supplySummary"
	"reporting-backend/internal/supplySummary/handler"
	"reporting-backend/internal/supplySummary/persistence"
	"reporting-backend/internal/supplySummary/service"

	"go.uber.org/fx"
)

func main() {
	app := fx.New(

		fx.Options(
			db.Module,
			persistence.Module,
			service.Module,
			handler.Module,
			supplysummary.Module,
		),
	) 
	
	app.Run()
}