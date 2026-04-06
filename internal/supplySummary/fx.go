package supplysummary

import "go.uber.org/fx"

var Module = fx.Module("server",
	fx.Provide(NewServer),
	fx.Invoke(StartServer),
)