# UML Activity Diagrams

This document contains Activity Diagrams for the project's key functionalities, formatted with Admin and System swimlanes.

---

## 1. Import Inventory by CSV

```mermaid
flowchart TB
    %% Definitions
    classDef startNode fill:#000,stroke:#000,stroke-width:2px,color:#fff;
    classDef endNode fill:#000,stroke:#f00,stroke-width:2px,color:#fff;
    classDef actionNode fill:#fff,stroke:#000,stroke-width:1px,rx:10,ry:10;
    classDef decisionNode fill:#fff,stroke:#000,stroke-width:1px,shape:diamond;

    subgraph ImportGroup ["IMPORT INVENTORY BY CSV"]
        direction TB
        
        subgraph AdminCol ["Admin"]
            direction TB
            Start1(( )):::startNode
            A1(Select CSV File):::actionNode
            A2(Click 'Import Inventory'):::actionNode
            A3(Display Result Message):::actionNode
            End1(( )):::endNode

            Start1 --> A1
            A1 --> A2
        end

        subgraph SystemCol ["System"]
            direction TB
            S1(Validate File Format):::actionNode
            D1{Is File Valid?}:::decisionNode
            S2(Parse & Validate Data):::actionNode
            D2{Is Data Valid?}:::decisionNode
            S3(Update/Insert Inventory):::actionNode
            S4(Return Success Response):::actionNode
            S5(Return Error Response):::actionNode

            A2 --> S1
            S1 --> D1
            D1 -- No --> S5
            D1 -- Yes --> S2
            S2 --> D2
            D2 -- No --> S5
            D2 -- Yes --> S3
            S3 --> S4
            S4 --> A3
            S5 --> A3
        end
        
        A3 --> End1
    end
```

---

## 2. Export Inventory by CSV

```mermaid
flowchart TB
    %% Definitions
    classDef startNode fill:#000,stroke:#000,stroke-width:2px,color:#fff;
    classDef endNode fill:#000,stroke:#f00,stroke-width:2px,color:#fff;
    classDef actionNode fill:#fff,stroke:#000,stroke-width:1px,rx:10,ry:10;
    classDef decisionNode fill:#fff,stroke:#000,stroke-width:1px,shape:diamond;

    subgraph ExportGroup ["EXPORT INVENTORY BY CSV"]
        direction TB

        subgraph AdminCol2 ["Admin"]
            direction TB
            Start2(( )):::startNode
            A2_1(Filter Inventory List):::actionNode
            A2_2(Click 'Export CSV'):::actionNode
            A2_3(Download CSV File):::actionNode
            End2(( )):::endNode

            Start2 --> A2_1
            A2_1 --> A2_2
        end

        subgraph SystemCol2 ["System"]
            direction TB
            S2_1(Query Inventory Data):::actionNode
            D2_1{Data Exists?}:::decisionNode
            S2_2(Generate CSV Content):::actionNode
            S2_3(Return CSV File):::actionNode
            S2_4(Return 'No Data' Error):::actionNode

            A2_2 --> S2_1
            S2_1 --> D2_1
            D2_1 -- No --> S2_4
            D2_1 -- Yes --> S2_2
            S2_2 --> S2_3
            S2_3 --> A2_3
            S2_4 --> A2_3
        end
        
        A2_3 --> End2
    end
```

---

## 3. Add Category

```mermaid
flowchart TB
    %% Definitions
    classDef startNode fill:#000,stroke:#000,stroke-width:2px,color:#fff;
    classDef endNode fill:#000,stroke:#f00,stroke-width:2px,color:#fff;
    classDef actionNode fill:#fff,stroke:#000,stroke-width:1px,rx:10,ry:10;
    classDef decisionNode fill:#fff,stroke:#000,stroke-width:1px,shape:diamond;

    subgraph AddCatGroup ["ADD CATEGORY"]
        direction TB

        subgraph AdminCol3 ["Admin"]
            direction TB
            Start3(( )):::startNode
            A3_1(Enter Category Info):::actionNode
            A3_2(Click 'Add Category'):::actionNode
            A3_3(Display Success/Error):::actionNode
            End3(( )):::endNode

            Start3 --> A3_1
            A3_1 --> A3_2
        end

        subgraph SystemCol3 ["System"]
            direction TB
            S3_1(Validate Input Data):::actionNode
            D3_1{Is Input Valid?}:::decisionNode
            S3_2(Check for Duplicate Name):::actionNode
            D3_2{Is Duplicate?}:::decisionNode
            S3_3(Insert Into Database):::actionNode
            S3_4(Return Success Response):::actionNode
            S3_5(Return Error Details):::actionNode

            A3_2 --> S3_1
            S3_1 --> D3_1
            D3_1 -- No --> S3_5
            D3_1 -- Yes --> S3_2
            S3_2 --> D3_2
            D3_2 -- Yes --> S3_5
            D3_2 -- No --> S3_3
            S3_3 --> S3_4
            S3_4 --> A3_3
            S3_5 --> A3_3
        end
        
        A3_3 --> End3
    end
```

---

## 4. Edit Category

```mermaid
flowchart TB
    %% Definitions
    classDef startNode fill:#000,stroke:#000,stroke-width:2px,color:#fff;
    classDef endNode fill:#000,stroke:#f00,stroke-width:2px,color:#fff;
    classDef actionNode fill:#fff,stroke:#000,stroke-width:1px,rx:10,ry:10;
    classDef decisionNode fill:#fff,stroke:#000,stroke-width:1px,shape:diamond;

    subgraph EditCatGroup ["EDIT CATEGORY"]
        direction TB

        subgraph AdminCol4 ["Admin"]
            direction TB
            Start4(( )):::startNode
            A4_1(Select Category to Edit):::actionNode
            A4_2(Update Information):::actionNode
            A4_3(Click 'Update'):::actionNode
            A4_4(Display Processing Result):::actionNode
            End4(( )):::endNode

            Start4 --> A4_1
            A4_1 --> A4_2
            A4_2 --> A4_3
        end

        subgraph SystemCol4 ["System"]
            direction TB
            S4_1(Validate Input Data):::actionNode
            D4_1{Is Input Valid?}:::decisionNode
            S4_2(Check Category Existence):::actionNode
            D4_2{Exists?}:::decisionNode
            S4_3(Update Database Record):::actionNode
            S4_4(Return Success Response):::actionNode
            S4_5(Return Error Response):::actionNode

            A4_3 --> S4_1
            S4_1 --> D4_1
            D4_1 -- No --> S4_5
            D4_1 -- Yes --> S4_2
            S4_2 --> D4_2
            D4_2 -- No --> S4_5
            D4_2 -- Yes --> S4_3
            S4_3 --> S4_4
            S4_4 --> A4_4
            S4_5 --> A4_4
        end
        
        A4_4 --> End4
    end
```

---

## 5. Delete Category

```mermaid
flowchart TB
    %% Definitions
    classDef startNode fill:#000,stroke:#000,stroke-width:2px,color:#fff;
    classDef endNode fill:#000,stroke:#f00,stroke-width:2px,color:#fff;
    classDef actionNode fill:#fff,stroke:#000,stroke-width:1px,rx:10,ry:10;
    classDef decisionNode fill:#fff,stroke:#000,stroke-width:1px,shape:diamond;

    subgraph DelCatGroup ["DELETE CATEGORY"]
        direction TB

        subgraph AdminCol5 ["Admin"]
            direction TB
            Start5(( )):::startNode
            A5_1(Select Category to Delete):::actionNode
            A5_2(Click 'Delete' & Confirm):::actionNode
            A5_3(Display Processing Result):::actionNode
            End5(( )):::endNode

            Start5 --> A5_1
            A5_1 --> A5_2
        end

        subgraph SystemCol5 ["System"]
            direction TB
            S5_1(Check Category Usage):::actionNode
            D5_1{In Use by Products?}:::decisionNode
            S5_2(Delete from Database):::actionNode
            S5_3(Return Success Response):::actionNode
            S5_4(Return 'In Use' Error):::actionNode

            A5_2 --> S5_1
            S5_1 --> D5_1
            D5_1 -- Yes --> S5_4
            D5_1 -- No --> S5_2
            S5_2 --> S5_3
            S5_3 --> A5_3
            S5_4 --> A5_3
        end
        
        A5_3 --> End5
    end
```

---

## 6. Export Report by CSV

```mermaid
flowchart TB
    %% Definitions
    classDef startNode fill:#000,stroke:#000,stroke-width:2px,color:#fff;
    classDef endNode fill:#000,stroke:#f00,stroke-width:2px,color:#fff;
    classDef actionNode fill:#fff,stroke:#000,stroke-width:1px,rx:10,ry:10;
    classDef decisionNode fill:#fff,stroke:#000,stroke-width:1px,shape:diamond;

    subgraph ExportRepGroup ["EXPORT REPORT BY CSV"]
        direction TB

        subgraph AdminCol6 ["Admin"]
            direction TB
            Start6(( )):::startNode
            A6_1(Select Report Type):::actionNode
            A6_2(Select Date Range & Filters):::actionNode
            A6_3(Click 'Export Report'):::actionNode
            A6_4(Download CSV File):::actionNode
            End6(( )):::endNode

            Start6 --> A6_1
            A6_1 --> A6_2
            A6_2 --> A6_3
        end

        subgraph SystemCol6 ["System"]
            direction TB
            S6_1(Validate Export Parameters):::actionNode
            D6_1{Are Params Valid?}:::decisionNode
            S6_2(Query Report Data):::actionNode
            D6_2{Data Found?}:::decisionNode
            S6_3(Generate CSV Content):::actionNode
            S6_4(Return CSV File):::actionNode
            S6_5(Return Error Response):::actionNode

            A6_3 --> S6_1
            S6_1 --> D6_1
            D6_1 -- No --> S6_5
            D6_1 -- Yes --> S6_2
            S6_2 --> D6_2
            D6_2 -- No --> S6_5
            D6_2 -- Yes --> S6_3
            S6_3 --> S6_4
            S6_4 --> A6_4
            S6_5 --> A6_4
        end
        
        A6_4 --> End6
    end
```
