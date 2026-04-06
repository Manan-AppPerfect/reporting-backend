package persistence

import "go.uber.org/fx"

var Module = fx.Module("capacity-repo",
	fx.Provide(
		NewRepository,
	),
)