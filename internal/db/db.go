package db

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewDB() (*gorm.DB, error) {

	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s dbname=%s port=5432 sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_NAME"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect to database: ", err)
	}

	log.Println("Connected to db")
	return db, nil
}