# UML Activity Diagrams - Bicycle Management System

This document contains Activity Diagrams with swimlanes for key functionalities.

---

## 1. IMPORT INVENTORY BY CSV FILE

```mermaid
graph TB
    subgraph " "
        subgraph Admin
            A_start((●))
            A1[Open Inventory<br/>Management page]
            A2[Click Import CSV button]
            A3[Select CSV file<br/>from computer]
            A4[Click Confirm Import]
            A_msg[Display message]
            A_end((⊙))
            
            A_start --> A1
            A1 --> A2
            A2 --> A3
            A3 --> A4
            A_msg --> A_end
        end
        
        subgraph System
            S1[Receive CSV file<br/>from Frontend]
            S2[Validate file format]
            S3{Is file<br/>format valid?}
            S4[Check CSV headers]
            S5{Are headers<br/>valid?}
            S6[Process each row<br/>in CSV file]
            S7[Validate row data]
            S8{Is data<br/>valid?}
            S9[Check if SKU exists<br/>in Database]
            S10{Does SKU<br/>exist?}
            S11[UPDATE inventory<br/>record in Database]
            S12[INSERT new inventory<br/>record in Database]
            S13{More<br/>rows?}
            S14[Return success response<br/>to Frontend]
            S15[Return validation<br/>error response]
            S16[Skip row and<br/>log error]
            
            S1 --> S2
            S2 --> S3
            S3 -->|No| S15
            S3 -->|Yes| S4
            S4 --> S5
            S5 -->|No| S15
            S5 -->|Yes| S6
            S6 --> S7
            S7 --> S8
            S8 -->|No| S16
            S8 -->|Yes| S9
            S9 --> S10
            S10 -->|Yes| S11
            S10 -->|No| S12
            S11 --> S13
            S12 --> S13
            S16 --> S13
            S13 -->|Yes| S6
            S13 -->|No| S14
            S14 --> A_msg
            S15 --> A_msg
        end
        
        A4 --> S1
    end
```

---

## 2. EXPORT INVENTORY BY CSV FILE

```mermaid
graph TB
    subgraph " "
        subgraph Admin
            A_start((●))
            A1[Open Inventory<br/>Management page]
            A2[Apply filters<br/>optional]
            A3[Click Export CSV button]
            A_msg[Display message or<br/>download file]
            A_end((⊙))
            
            A_start --> A1
            A1 --> A2
            A2 --> A3
            A_msg --> A_end
        end
        
        subgraph System
            S1[Receive export request<br/>from Frontend]
            S2[Query inventory data<br/>from Database]
            S3{Is data<br/>available?}
            S4[Convert data to<br/>CSV format]
            S5[Add CSV headers]
            S6[Format data rows]
            S7[Encode as UTF-8]
            S8[Return CSV file<br/>to Frontend]
            S9[Return no data<br/>error response]
            
            S1 --> S2
            S2 --> S3
            S3 -->|No| S9
            S3 -->|Yes| S4
            S4 --> S5
            S5 --> S6
            S6 --> S7
            S7 --> S8
            S8 --> A_msg
            S9 --> A_msg
        end
        
        A3 --> S1
    end
```

---

## 3. ADD CATEGORY

```mermaid
graph TB
    subgraph " "
        subgraph Admin
            A_start((●))
            A1[Open Category<br/>Management page]
            A2[Click Add Category button]
            A3[Enter category information<br/>name, description, status]
            A4[Click Save button]
            A_msg[Display message]
            A_end((⊙))
            
            A_start --> A1
            A1 --> A2
            A2 --> A3
            A3 --> A4
            A_msg --> A_end
        end
        
        subgraph System
            S1[Receive category data<br/>from Frontend]
            S2[Validate input data]
            S3{Is data<br/>valid?}
            S4[Check if category<br/>name exists in Database]
            S5{Does name<br/>already exist?}
            S6[INSERT new category<br/>into Database]
            S7[Return success<br/>response to Frontend]
            S8[Return validation<br/>error response]
            S9[Return duplicate<br/>error response]
            
            S1 --> S2
            S2 --> S3
            S3 -->|No| S8
            S3 -->|Yes| S4
            S4 --> S5
            S5 -->|Yes| S9
            S5 -->|No| S6
            S6 --> S7
            S7 --> A_msg
            S8 --> A_msg
            S9 --> A_msg
        end
        
        A4 --> S1
    end
```

---

## 4. EDIT CATEGORY

```mermaid
graph TB
    subgraph " "
        subgraph Admin
            A_start((●))
            A1[Open Category<br/>Management page]
            A2[Select category to edit]
            A3[Click Edit button]
            A4[Modify category information<br/>name, description, status]
            A5[Click Update button]
            A_msg[Display message]
            A_end((⊙))
            
            A_start --> A1
            A1 --> A2
            A2 --> A3
            A3 --> A4
            A4 --> A5
            A_msg --> A_end
        end
        
        subgraph System
            S1[Receive updated<br/>category data from Frontend]
            S2[Validate input data]
            S3{Is data<br/>valid?}
            S4[Check if category<br/>exists in Database]
            S5{Does category<br/>exist?}
            S6[Check if new name exists<br/>excluding current category]
            S7{Does name<br/>already exist?}
            S8[UPDATE category<br/>in Database]
            S9[Return success<br/>response to Frontend]
            S10[Return validation<br/>error response]
            S11[Return not found<br/>error response]
            S12[Return duplicate<br/>error response]
            
            S1 --> S2
            S2 --> S3
            S3 -->|No| S10
            S3 -->|Yes| S4
            S4 --> S5
            S5 -->|No| S11
            S5 -->|Yes| S6
            S6 --> S7
            S7 -->|Yes| S12
            S7 -->|No| S8
            S8 --> S9
            S9 --> A_msg
            S10 --> A_msg
            S11 --> A_msg
            S12 --> A_msg
        end
        
        A5 --> S1
    end
```

---

## 5. DELETE CATEGORY

```mermaid
graph TB
    subgraph " "
        subgraph Admin
            A_start((●))
            A1[Open Category<br/>Management page]
            A2[Select category to delete]
            A3[Click Delete button]
            A4{Confirm<br/>deletion?}
            A_msg[Display message]
            A_end((⊙))
            
            A_start --> A1
            A1 --> A2
            A2 --> A3
            A3 --> A4
            A4 -->|No| A_end
            A_msg --> A_end
        end
        
        subgraph System
            S1[Receive delete request<br/>from Frontend]
            S2[Check if category<br/>exists in Database]
            S3{Does category<br/>exist?}
            S4[Check if category<br/>has associated products]
            S5{Has<br/>products?}
            S6[DELETE category<br/>from Database]
            S7[Return success<br/>response to Frontend]
            S8[Return not found<br/>error response]
            S9[Return in-use<br/>error response]
            
            S1 --> S2
            S2 --> S3
            S3 -->|No| S8
            S3 -->|Yes| S4
            S4 --> S5
            S5 -->|Yes| S9
            S5 -->|No| S6
            S6 --> S7
            S7 --> A_msg
            S8 --> A_msg
            S9 --> A_msg
        end
        
        A4 -->|Yes| S1
    end
```

---

## 6. EXPORT REPORT BY CSV

```mermaid
graph TB
    subgraph " "
        subgraph Admin
            A_start((●))
            A1[Open Reports page]
            A2[Select report type<br/>Sales, Inventory, Orders, Revenue]
            A3[Select date range<br/>start date, end date]
            A4[Apply filters<br/>optional]
            A5[Click Export Report button]
            A_msg[Display message or<br/>download file]
            A_end((⊙))
            
            A_start --> A1
            A1 --> A2
            A2 --> A3
            A3 --> A4
            A4 --> A5
            A_msg --> A_end
        end
        
        subgraph System
            S1[Receive export request<br/>from Frontend]
            S2[Validate parameters<br/>report type, date range]
            S3{Are parameters<br/>valid?}
            S4[Query report data<br/>from Database]
            S5{Is data<br/>available?}
            S6[Process and<br/>aggregate data]
            S7[Convert to CSV format]
            S8[Add CSV headers]
            S9[Format data rows]
            S10[Add summary row]
            S11[Encode as UTF-8]
            S12[Return CSV file<br/>to Frontend]
            S13[Return validation<br/>error response]
            S14[Return no data<br/>error response]
            
            S1 --> S2
            S2 --> S3
            S3 -->|No| S13
            S3 -->|Yes| S4
            S4 --> S5
            S5 -->|No| S14
            S5 -->|Yes| S6
            S6 --> S7
            S7 --> S8
            S8 --> S9
            S9 --> S10
            S10 --> S11
            S11 --> S12
            S12 --> A_msg
            S13 --> A_msg
            S14 --> A_msg
        end
        
        A5 --> S1
    end
```

---

## Diagram Legend

| Symbol | Meaning | Description |
|--------|---------|-------------|
| ● | Initial Node | Start point (black filled circle) |
| ⊙ | Final Node | End point (circle with border) |
| ▭ | Activity Node | Action or process step (rounded rectangle) |
| ⬟ | Decision Node | Branch point with conditions (diamond) |
| → | Flow Arrow | Direction of activity flow |

---

## Notes

### Swimlane Structure
- **Admin Column (Left)**: Contains all user interactions and UI actions
- **System Column (Right)**: Contains all backend processing, validation, and database operations

### Flow Characteristics
- Each diagram has a clear title at the top
- Flows from top to bottom within each swimlane
- Arrows cross between swimlanes to show interaction
- All paths eventually lead to a final node (⊙)

### Decision Nodes
- Diamond shapes represent decision points
- Each decision has Yes/No branches clearly labeled
- Conditions are stated as questions

### Activity Nodes
- Rounded rectangles for all actions
- Multi-line text for detailed descriptions
- Clear, concise action descriptions

---

## Process Summary

| Process | Key Steps | Decision Points | End Result |
|---------|-----------|-----------------|------------|
| **Import Inventory CSV** | Upload → Validate → Process → Update/Insert | File valid? Headers valid? Data valid? SKU exists? | Success with statistics or error message |
| **Export Inventory CSV** | Request → Query → Convert → Generate | Data available? | Download CSV file or error message |
| **Add Category** | Enter info → Validate → Check duplicate → Insert | Data valid? Name exists? | Success or error message |
| **Edit Category** | Select → Modify → Validate → Check → Update | Data valid? Category exists? Name exists? | Success or error message |
| **Delete Category** | Select → Confirm → Check → Delete | Confirm? Category exists? Has products? | Success or warning message |
| **Export Report CSV** | Select type → Date range → Filters → Generate | Parameters valid? Data available? | Download report or error message |
