package supplysummary

import (
	"context"
	"log"
	"net/http"
	"reporting-backend/internal/supplySummary/handler"
	api "reporting-backend/internal/supplySummary/server"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.uber.org/fx"
)

type Params struct {
	fx.In
	Handler *handler.Handler
}

func NewServer(p Params) *http.Server {
	router := gin.Default()

	router.Use(cors.Default())

	api.RegisterHandlers(router, p.Handler)

	return &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

}

func StartServer(lc fx.Lifecycle, server *http.Server) {

	lc.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {

			go func() {
				log.Println("Server running on :8080")

				if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
					log.Fatalf("Server failed: %v", err)
				}
			}()

			return nil
		},

		OnStop: func(ctx context.Context) error {
			log.Println("Shutting down server...")
			
			shutdownCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
			defer cancel()

			return server.Shutdown(shutdownCtx)
		},
	})
}