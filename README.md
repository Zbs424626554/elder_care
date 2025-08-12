# MongoDB 数据导入工具

这个工具用于将 `data` 目录中的 JSON 文件导入到 MongoDB 数据库中。

## 使用Python脚本导入数据

### 1. 安装 Python 依赖

```bash
pip install -r requirements.txt
```

### 2. 配置数据库连接

在 `import_mongodb_data.py` 文件中，可以根据需要修改以下配置：

```python
CONFIG = {
    # MongoDB连接URI，可以是本地或远程数据库
    "uri": "mongodb://localhost:27017/",
    
    # 数据库名称
    "db_name": "elder_care",
    
    # 数据文件所在目录
    "data_dir": "./data",
    
    # 是否在导入前删除现有集合
    "drop_existing": True,
    
    # 连接超时时间（毫秒）
    "timeout": 5000
}
```

### 3. 运行导入脚本

```bash
python import_mongodb_data.py
```

## 数据文件

所有放置在 `data` 目录中的 JSON 文件将被导入到数据库中，集合名称与文件名相同（不含 .json 扩展名）。例如：

- users.json → users 集合
- announcements.json → announcements 集合
- payments.json → payments 集合
- health_records.json → health_records 集合
- support_tickets.json → support_tickets 集合
- complaints.json → complaints 集合
- reviews.json → reviews 集合
- orders.json → orders 集合
- permissions.json → permissions 集合
- statistics.json → statistics 集合
- system_config.json → system_config 集合
- services.json → services 集合

## 注意事项

- 默认情况下，脚本会先删除已存在的同名集合，然后再导入新数据
- 导入过程中会显示每个文件的导入状态
- 如果遇到连接问题，请确保MongoDB服务正在运行，或者检查连接URI是否正确
- 对于远程MongoDB服务（如MongoDB Atlas），请确保您的IP已添加到白名单中 