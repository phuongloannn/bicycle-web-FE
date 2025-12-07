# UML Sequence Diagram - Export Report by CSV

This document contains 1 comprehensive UML Sequence Diagram for Export Report by CSV operation.

---

## Export Report by CSV File

### Use Case: Export Report by CSV File

**Actor:** Admin

**Description:** Admin can export various reports (sales, inventory, orders, revenue) as CSV files for analysis, reporting, or offline processing. The system allows the admin to select report type, apply date range and filters, generates the report data from the backend via API (exportReport), converts it to CSV format, and allows the admin to download the file to their computer.

**Preconditions:**
- Admin is logged in
- Admin has access to Reports page
- Backend has report data available
- API works (getReportTypes, exportReport)

**Post-conditions:**
- CSV report file is downloaded to admin's computer
- No changes to database
- System logs export report activity (timestamp, admin_id, report_type, filters, record_count)
- Original data remains unchanged

---

### Comprehensive Sequence Diagram - Export Report (All Flows Combined)

This diagram shows the complete export report flow including:
- **Basic Flow**: Successful export of report data
- **Alternative Flow A1**: No data available for selected criteria
- **Alternative Flow A2**: Invalid date range or filter parameters
- **Alternative Flow A3**: Backend/Database errors or CSV generation errors
- **Optional Flow**: Apply filters and date range before export

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant Backend
    participant Database

    Admin->>Frontend: 1. Opens Reports page
    Frontend->>Backend: GET /api/getReportTypes
    Backend-->>Frontend: Return available report types(Sales, Inventory, Orders, Revenue)
    Frontend-->>Admin: Display Reports page with report type options

    Admin->>Frontend: 2. Selects report type(e.g., "Sales Report")
    Frontend-->>Admin: Display report configuration panel

    rect rgb(240, 255, 240)
        Note over Admin,Frontend: OPTIONAL: Apply Filters and Date Range
        Admin->>Frontend: 3a. Selects date range(start_date, end_date)
        Admin->>Frontend: 3b. Applies filters(category, product, customer, status, etc.)
        Frontend->>Frontend: Validate date range
        
        alt Invalid date range
            rect rgb(255, 240, 240)
                Note over Frontend,Admin: ALTERNATIVE FLOW A2: Invalid Date Range
                Frontend-->>Admin: ❌ Display error: "Invalid date range.End date must be after start date"
                Admin->>Frontend: Corrects date range
            end
        end
        
        Frontend->>Frontend: Store filter parameters
    end

    Admin->>Frontend: 4. Clicks "Export Report" button
    
    Frontend->>Frontend: 5. Validate export parameters
    
    alt Missing required parameters
        rect rgb(255, 240, 240)
            Note over Frontend,Admin: ALTERNATIVE FLOW A2: Missing Parameters
            Frontend-->>Admin: ❌ Display error: "Please select report typeand date range"
            Note over Admin,Frontend: Admin must complete selection
        end
    else Valid parameters
        alt With filters applied
            Frontend->>Backend: 6. POST /api/exportReport{type, start_date, end_date, filters}
        else Without filters
            Frontend->>Backend: 6. POST /api/exportReport{type, start_date, end_date}
        end
        
        alt Database connection error
            rect rgb(255, 235, 235)
                Note over Backend,Database: ALTERNATIVE FLOW A3: Database Error
                Backend->>Database: Query report data
                Database-->>Backend: ❌ Connection/Query error
                Backend-->>Frontend: ❌ Return error {error: "Database error",status: 500}
                Frontend-->>Admin: ❌ Display error: "Export failed.Please try again"
                Admin->>Frontend: Clicks "Export Report" again (retry)
                Note over Admin,Frontend: Admin can retry export
            end
        else Database query successful
            Backend->>Database: 7a. Query report data based on type and filters
            
            Note over Backend,Database: Generating Report Data
            alt Sales Report
                Backend->>Database: SELECT sales dataJOIN products, customersWHERE date BETWEEN ? AND ?
            else Inventory Report
                Backend->>Database: SELECT inventory dataJOIN categories, suppliersWHERE conditions
            else Orders Report
                Backend->>Database: SELECT orders dataJOIN customers, productsWHERE date BETWEEN ? AND ?
            else Revenue Report
                Backend->>Database: SELECT revenue dataGROUP BY periodWHERE date BETWEEN ? AND ?
            end
            
            Database-->>Backend: Return report records
            
            alt No data available
                rect rgb(255, 248, 240)
                    Note over Backend,Frontend: ALTERNATIVE FLOW A1: No Report Data
                    Database-->>Backend: ⚠️ Return empty result set
                    Backend->>Backend: Check if data is empty
                    Backend-->>Frontend: ⚠️ Return response {error: "No data",message: "No data available for selected criteria"}
                    Frontend-->>Admin: ℹ️ Display info message:"No data available for the selected period and filters.Please try different criteria"
                    Note over Admin: No file is downloaded
                end
            else Data available
                Backend->>Backend: 7b. Process and aggregate data(calculations, summaries)
                Backend->>Backend: 7c. Format data for CSV export
                
                rect rgb(240, 248, 255)
                    Note over Backend: CSV Generation Process
                    Backend->>Backend: 8a. Convert data to CSV format
                    
                    alt Sales Report CSV
                        Backend->>Backend: Add headers: Order_ID, Date, Customer,Product, Quantity, Unit_Price, Total, Status
                    else Inventory Report CSV
                        Backend->>Backend: Add headers: SKU, Product_Name, Category,Quantity, Unit_Price, Supplier, Last_Update
                    else Orders Report CSV
                        Backend->>Backend: Add headers: Order_ID, Date, Customer,Total_Amount, Status, Payment_Method
                    else Revenue Report CSV
                        Backend->>Backend: Add headers: Period, Total_Sales,Total_Orders, Average_Order_Value, Revenue
                    end
                    
                    Backend->>Backend: 8b. Format data rows
                    Backend->>Backend: 8c. Add summary/totals row (if applicable)
                    Backend->>Backend: 8d. Encode as UTF-8
                end
                
                alt CSV generation error
                    rect rgb(255, 235, 235)
                        Note over Backend,Frontend: ALTERNATIVE FLOW A3: CSV Generation Error
                        Backend->>Backend: ❌ Attempt to generate CSV fails
                        Backend-->>Frontend: ❌ Return error {error: "Export failed",status: 500}
                        Frontend-->>Admin: ❌ Display error: "Failed to generate report.Please try again"
                        Note over Admin,Frontend: Admin can retry
                    end
                else CSV generated successfully
                    Backend-->>Frontend: 9. Return CSV file (Content-Type: text/csv; charset=utf-8)
                    
                    Frontend->>Frontend: 10. Trigger file download
                    
                    alt Sales Report
                        Frontend-->>Admin: 📥 Browser downloads"sales_report_YYYY-MM-DD_to_YYYY-MM-DD.csv"
                    else Inventory Report
                        Frontend-->>Admin: 📥 Browser downloads"inventory_report_YYYY-MM-DD.csv"
                    else Orders Report
                        Frontend-->>Admin: 📥 Browser downloads"orders_report_YYYY-MM-DD_to_YYYY-MM-DD.csv"
                    else Revenue Report
                        Frontend-->>Admin: 📥 Browser downloads"revenue_report_YYYY-MM-DD_to_YYYY-MM-DD.csv"
                    end
                    
                    Frontend-->>Admin: ✅ Display success message:"Report exported successfully"
                    
                    Admin->>Admin: 11. Opens CSV file in Excel/Sheets
                    Admin->>Admin: ✅ Analyzes report data offline
                end
            end
        end
    end
```


---

## Report Types and Data Specifications

### 1. Sales Report CSV Format

**Description:** Detailed sales transactions within a date range

**Headers (UTF-8):**
```
Order_ID,Date,Customer_Name,Customer_Email,Product_Name,SKU,Quantity,Unit_Price,Total_Amount,Discount,Tax,Grand_Total,Payment_Method,Status
```

**Example Data:**
```csv
Order_ID,Date,Customer_Name,Customer_Email,Product_Name,SKU,Quantity,Unit_Price,Total_Amount,Discount,Tax,Grand_Total,Payment_Method,Status
ORD-001,2025-12-01 10:30:00,John Doe,john@email.com,Mountain Bike X1,MTB-001,1,599.99,599.99,0.00,59.99,659.98,Credit Card,Completed
ORD-001,2025-12-01 10:30:00,John Doe,john@email.com,Bike Helmet,HLM-001,1,49.99,49.99,5.00,4.49,49.48,Credit Card,Completed
ORD-002,2025-12-02 14:15:00,Jane Smith,jane@email.com,Road Bike R2,RDB-002,1,899.99,899.99,50.00,84.99,934.98,PayPal,Completed
SUMMARY,,,,,Total Orders: 2,Total Items: 3,,1549.97,55.00,149.47,1644.44,,
```

---

### 2. Inventory Report CSV Format

**Description:** Current inventory status snapshot

**Headers (UTF-8):**
```
SKU,Product_Name,Category,Quantity_In_Stock,Reorder_Level,Unit_Cost,Unit_Price,Total_Value,Supplier,Last_Restocked,Status
```

**Example Data:**
```csv
SKU,Product_Name,Category,Quantity_In_Stock,Reorder_Level,Unit_Cost,Unit_Price,Total_Value,Supplier,Last_Restocked,Status
MTB-001,Mountain Bike X1,Mountain Bikes,15,5,450.00,599.99,6749.85,BikeSupplier Inc,2025-11-15,In Stock
RDB-002,Road Bike R2,Road Bikes,8,3,650.00,899.99,5199.92,BikeSupplier Inc,2025-11-20,In Stock
HLM-001,Bike Helmet,Accessories,45,10,25.00,49.99,1125.00,SafetyGear Co,2025-12-01,In Stock
CHN-003,Bike Chain,Parts,120,20,8.00,15.99,960.00,PartsMaster Ltd,2025-11-25,In Stock
TIR-004,Road Tire 700x25,Tires,3,10,20.00,39.99,60.00,TirePro,2025-10-15,Low Stock
SUMMARY,,,Total Items: 191,,,Total Value: 14094.77,,,
```

---

### 3. Orders Report CSV Format

**Description:** Summary of orders within a date range

**Headers (UTF-8):**
```
Order_ID,Order_Date,Customer_Name,Customer_Email,Customer_Phone,Total_Items,Subtotal,Discount,Tax,Shipping,Grand_Total,Payment_Method,Payment_Status,Order_Status,Delivery_Date
```

**Example Data:**
```csv
Order_ID,Order_Date,Customer_Name,Customer_Email,Customer_Phone,Total_Items,Subtotal,Discount,Tax,Shipping,Grand_Total,Payment_Method,Payment_Status,Order_Status,Delivery_Date
ORD-001,2025-12-01 10:30:00,John Doe,john@email.com,+1234567890,2,649.98,5.00,64.49,10.00,719.47,Credit Card,Paid,Delivered,2025-12-05
ORD-002,2025-12-02 14:15:00,Jane Smith,jane@email.com,+1987654321,1,899.99,50.00,84.99,15.00,949.98,PayPal,Paid,Shipped,2025-12-08
ORD-003,2025-12-03 09:45:00,Bob Johnson,bob@email.com,+1122334455,3,1249.97,0.00,124.99,10.00,1384.96,Bank Transfer,Pending,Processing,
SUMMARY,,,,,Total Orders: 3,Total Items: 6,2799.94,55.00,274.47,35.00,3054.41,,,
```

---

### 4. Revenue Report CSV Format

**Description:** Revenue summary grouped by period (daily, weekly, monthly)

**Headers (UTF-8):**
```
Period,Period_Start,Period_End,Total_Orders,Total_Items_Sold,Gross_Revenue,Total_Discounts,Total_Tax,Net_Revenue,Average_Order_Value,Top_Category
```

**Example Data:**
```csv
Period,Period_Start,Period_End,Total_Orders,Total_Items_Sold,Gross_Revenue,Total_Discounts,Total_Tax,Net_Revenue,Average_Order_Value,Top_Category
Week 48,2025-11-25,2025-12-01,45,128,25489.55,1245.50,2498.95,26742.00,594.26,Mountain Bikes
Week 49,2025-12-02,2025-12-08,52,145,28765.40,1580.25,2826.54,29011.69,557.92,Road Bikes
Week 50,2025-12-09,2025-12-15,38,95,19234.80,890.00,1913.48,20258.28,533.31,Accessories
SUMMARY,2025-11-25,2025-12-15,135,368,73489.75,3715.75,7238.97,76012.97,544.37,
```

---

## API Endpoints

### 1. Get Report Types

**Endpoint:** `GET /api/getReportTypes`

**Response:**
```json
{
  "status": "success",
  "report_types": [
    {
      "id": "sales",
      "name": "Sales Report",
      "description": "Detailed sales transactions",
      "requires_date_range": true,
      "available_filters": ["category", "product", "customer", "status"]
    },
    {
      "id": "inventory",
      "name": "Inventory Report",
      "description": "Current inventory status",
      "requires_date_range": false,
      "available_filters": ["category", "supplier", "status"]
    },
    {
      "id": "orders",
      "name": "Orders Report",
      "description": "Order summary",
      "requires_date_range": true,
      "available_filters": ["status", "payment_method", "customer"]
    },
    {
      "id": "revenue",
      "name": "Revenue Report",
      "description": "Revenue analysis by period",
      "requires_date_range": true,
      "available_filters": ["period_type", "category"]
    }
  ]
}
```

---

### 2. Export Report

**Endpoint:** `POST /api/exportReport`

**Request:**
```json
{
  "report_type": "sales",
  "start_date": "2025-12-01",
  "end_date": "2025-12-07",
  "filters": {
    "category": "Mountain Bikes",
    "status": "Completed"
  },
  "format": "csv"
}
```

**Response (Success):**
- Content-Type: text/csv; charset=utf-8
- Content-Disposition: attachment; filename="sales_report_2025-12-01_to_2025-12-07.csv"
- Body: CSV file content

**Response (Error - No Data):**
```json
{
  "status": "error",
  "error": "No data",
  "message": "No data available for the selected criteria"
}
```

**Response (Error - Invalid Parameters):**
```json
{
  "status": "error",
  "error": "Invalid parameters",
  "message": "End date must be after start date"
}
```

**Response (Error - Backend Error):**
```json
{
  "status": "error",
  "error": "Export failed",
  "message": "Failed to generate report",
  "status": 500
}
```

---

## Validation Rules

### Export Report Validation

1. **Report Type Validation:**
   - Required field
   - Must be one of: "sales", "inventory", "orders", "revenue"

2. **Date Range Validation:**
   - start_date: Required for time-based reports (sales, orders, revenue)
   - end_date: Required for time-based reports
   - end_date must be >= start_date
   - Date range should not exceed 1 year (configurable)
   - Format: YYYY-MM-DD or ISO 8601

3. **Filter Validation:**
   - Optional parameters
   - Filters must be valid for the selected report type
   - Filter values must match expected data types

4. **Performance Limits:**
   - Maximum date range: 365 days
   - Maximum records per export: 100,000 rows
   - Large exports may be queued for background processing

---

## Flow Summary

### Export Report - All Flows Combined

| Flow Type | Trigger Condition | Result |
|-----------|------------------|--------|
| **Basic Flow** | Valid report type, date range, and filters selected | ✅ CSV report file successfully downloaded |
| **Optional: Filters** | Admin applies filters before export | 📥 CSV contains only filtered data |
| **A1: No Data** | No data available for selected criteria | ℹ️ Info message displayed, no file downloaded |
| **A2: Invalid Parameters** | Missing report type, invalid date range, or wrong filter format | ❌ Validation error displayed |
| **A3: Database Error** | Database connection or query fails | ❌ Error message displayed, allows retry |
| **A3: CSV Error** | CSV generation process fails | ❌ Error message displayed, allows retry |

---

## Special Requirements

### Export Requirements

1. **CSV File Format:**
   - UTF-8 encoding
   - Comma (,) as delimiter
   - Double quotes for fields containing commas or special characters
   - Include summary/totals row when applicable

2. **File Naming Convention:**
   - Sales Report: `sales_report_YYYY-MM-DD_to_YYYY-MM-DD.csv`
   - Inventory Report: `inventory_report_YYYY-MM-DD.csv`
   - Orders Report: `orders_report_YYYY-MM-DD_to_YYYY-MM-DD.csv`
   - Revenue Report: `revenue_report_YYYY-MM-DD_to_YYYY-MM-DD.csv`

3. **Performance Optimization:**
   - Large reports (>10,000 rows) should show progress indicator
   - Very large reports (>100,000 rows) should be processed in background
   - Implement pagination for database queries
   - Cache frequently requested reports

4. **Data Formatting:**
   - Dates: ISO 8601 format (YYYY-MM-DD HH:MM:SS)
   - Currency: Decimal with 2 places, no currency symbol
   - Percentages: Decimal format (e.g., 0.15 for 15%)
   - Numbers: Proper thousand separators in display (optional in CSV)

5. **Security:**
   - Verify admin has permission to export reports
   - Log all export activities
   - Sanitize data to prevent CSV injection attacks
   - Rate limiting to prevent abuse

---

## Error Handling

### Export Errors

- **Missing parameters:** Display clear validation message
- **Invalid date range:** Show specific error about date requirements
- **No data available:** Display informational message, suggest different criteria
- **Database connection error:** Display error, suggest retry
- **CSV generation error:** Log error details, display user-friendly message
- **Timeout for large datasets:** Implement background job or pagination

---

## Notes

- **Color coding in diagrams:**
  - 🟢 Green background (`rgb(240, 255, 240)`): Optional filter selection
  - 🔵 Blue background (`rgb(240, 248, 255)`): CSV generation process
  - 🟡 Orange background (`rgb(255, 248, 240)`): Warning/no data flows
  - 🔴 Red background (`rgb(255, 235, 235)`): Error flows
  - 🔴 Light red background (`rgb(255, 240, 240)`): Validation errors

- All timestamps are in ISO 8601 format (UTC)
- CSV files use comma (,) as delimiter
- String values containing commas are enclosed in double quotes
- Summary rows are clearly marked and formatted
- Reports can be scheduled for automatic generation (future enhancement)
- Support for multiple export formats (PDF, Excel) can be added
