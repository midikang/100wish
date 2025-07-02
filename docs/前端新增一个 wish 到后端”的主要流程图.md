下面是“前端新增一个 wish 到后端”的主要流程图（文字版，适合直接复制到 markdown 或 mermaid 工具中渲染）：


sequenceDiagram
    participant 用户
    participant 前端页面 as NewWishView.vue
    participant Store as wishStore.ts
    participant API as wishApi (api.ts)
    participant Axios
    participant Server as Express路由
    participant DB as SQLite

    用户->>前端页面: 填写愿望并点击保存
    前端页面->>Store: 调用 addWish(wishData)
    Store->>API: wishApi.createWish(wishData)
    API->>Axios: POST /api/wishes
    Axios->>Server: HTTP POST /api/wishes
    Server->>Server: validateWishData & formatWishData
    Server->>DB: dbOperations.createWish(wishData)
    DB-->>Server: 新 wish（含 id, createdAt, updatedAt）
    Server-->>Axios: 返回新 wish
    Axios-->>API: 返回新 wish
    API-->>Store: 返回新 wish
    Store->>Store: 调用 loadWishes() 刷新
    Store->>API: wishApi.getAllWishes()
    API->>Axios: GET /api/wishes
    Axios->>Server: HTTP GET /api/wishes
    Server->>DB: dbOperations.getAllWishes()
    DB-->>Server: 所有 wish 列表
    Server-->>Axios: 返回 wish 列表
    Axios-->>API: 返回 wish 列表
    API-->>Store: 返回 wish 列表
    Store->>前端页面: 更新 wishes 状态