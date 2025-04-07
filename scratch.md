## ScrapingBee extract rules

### indeed

```json
{
  "results": {
    "selector": "/html/body/main/div/div[2]/div/div[5]/div/div[1]/div[5]/div",
    "type": "list",
    "output": {
      "link": {
        "selector": "/html/body/main/div/div[2]/div/div[5]/div/div[1]/div[5]/div/ul/li[2]/div/div/div/div/div/div/table/tbody/tr/td[1]/div[1]/h2/a",
        "output": "@href"
      },
      "title": "/html/body/main/div/div[2]/div/div[5]/div/div[1]/div[5]/div/ul/li[2]/div/div/div/div/div/div/table/tbody/tr/td[1]/div[1]/h2/a/span",
      "job_id": {
        "selector": "/html/body/main/div/div[2]/div/div[5]/div/div[1]/div[5]/div/ul/li[2]/div/div/div/div/div/div/table/tbody/tr/td[1]/div[1]/h2/a",
        "output": "@id"
      },
      "type": "/html/body/main/div/div[2]/div/div[5]/div/div[1]/div[5]/div/ul/li[2]/div/div/div/div/div/div/table/tbody/tr/td[1]/div[3]/ul/li[2]/div",
      "budget": "/html/body/main/div/div[2]/div/div[5]/div/div[1]/div[5]/div/ul/li[2]/div/div/div/div/div/div/table/tbody/tr/td[1]/div[3]/ul/li[1]/div/div",
      "company_logo": {
        "selector": "/html/body/main/div/div[2]/div/div[5]/div/div[1]/div[5]/div/ul/li[2]/div/div/div/div/div/div/table/tbody/tr/td[1]/div[2]/div[1]/div/img",
        "output": "@src"
      },
      "company_name": "/html/body/main/div/div[2]/div/div[5]/div/div[1]/div[5]/div/ul/li[2]/div/div/div/div/div/div/table/tbody/tr/td[1]/div[2]/div[2]/div[1]/span[1]",
      "company_location": "/html/body/main/div/div[2]/div/div[5]/div/div[1]/div[5]/div/ul/li[2]/div/div/div/div/div/div/table/tbody/tr/td[1]/div[2]/div[2]/div[2]"
    }
  }
}
```

### AI Rules JSON

```json
{
  "results": {
    "type": "list",
    "description": "an array of every jobs listed",
    "output": {
      "link": {
        "type": "string",
        "description": "extract job listing URL from href attribute"
      },
      "title": {
        "type": "string",
        "description": "extract job position title text"
      },
      "job_id": {
        "type": "string",
        "description": "extract ID attribute starting with sj_"
      },
      "type": {
        "type": "string",
        "description": "extract employment type (full-time, part-time, contract)"
      },
      "budget": {
        "type": "string",
        "description": "extract salary or compensation amount"
      },
      "company_logo": {
        "type": "string",
        "description": "extract company logo image URL from src attribute if available, otherwise default to null"
      },
      "company_name": {
        "type": "string",
        "description": "extract company or employer name text"
      },
      "company_location": {
        "type": "string",
        "description": "extract job location or address text"
      }
    }
  }
}
```
