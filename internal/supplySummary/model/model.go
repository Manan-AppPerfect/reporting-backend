package model

import "time"

type Capacity struct {
	ID 			int 		`gorm:"primaryKey"`
	Date 		time.Time	`gorm:"column:date"`
	Csp			string		`gorm:"column:csp"`
	GpuType		string		`gorm:"column:gpu_type"`
	Contracted	int			`gorm:"column:contracted"`
	Delivered	int			`gorm:"column:delivered"`
}

func (Capacity) TableName() string {
	return "supply_summary_data"
}