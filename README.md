# HN Scraper Assignment

This project is designed to scrape data from [Hacker News](https://news.ycombinator.com/) and organize it based on the number of comments. The results are exported to a PostgreSQL database, and you can retrieve the data in either JSON or CSV format. The project continuously scrapes data every minute.

## Prerequisites

Before running the application, make sure you have the following installed:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Getting Started

1. Clone this repository to your local machine:

```bash
git clone https://github.com/msanjeevkumar/hn-scraper.git 
cd hn-scraper
```
2. Run the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```
3. Install dependencies:

```bash
npm install
```

4. Start the application:
```bash
npm start
```

This will initiate the scraping process and update the database every minute.

## Endpoints

### */posts*

Retrieve scraped data in JSON format.

#### Example:

```bash
curl http://localhost:3000/posts
```

### */posts?format=excel*

Download the scraped data in Excel format.

#### Example:

```bash
curl http://localhost:3000/posts?format=excel --output hacker-news-data.xlsx
```

## Contributing

If you have suggestions, improvements, or find any issues, feel free to open an [issue](https://github.com/msanjeevkumar/hn-scraper/issues) or create a [pull request](https://github.com/msanjeevkumar/hn-scraper/pulls).
