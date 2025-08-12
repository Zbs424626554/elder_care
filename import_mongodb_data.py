#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
MongoDB数据导入工具
用于将data目录中的JSON文件导入到MongoDB数据库
"""

import os
import json
import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from bson import json_util

# 配置部分 - 可根据需要修改
CONFIG = {
    # MongoDB连接URI（默认本地，如需Atlas请设置环境变量 MONGODB_URI 覆盖）
    "uri": os.getenv("MONGODB_URI", "mongodb://localhost:27017/"),

    # 数据库名称
    "db_name": os.getenv("MONGODB_DB_NAME", "elder_care"),

    # 数据文件所在目录
    "data_dir": os.getenv("DATA_DIR", "./data"),

    # 是否在导入前删除现有集合
    "drop_existing": os.getenv("DROP_EXISTING", "true").lower() == "true",

    # 连接超时时间（毫秒）
    "timeout": int(os.getenv("MONGODB_TIMEOUT_MS", "5000"))
}

def connect_to_mongodb():
    """连接到MongoDB数据库"""
    try:
        # 创建MongoDB客户端连接
        client = MongoClient(CONFIG["uri"], serverSelectionTimeoutMS=CONFIG["timeout"])
        
        # 测试连接
        client.admin.command('ping')
        
        print(f"[OK] 成功连接到MongoDB: {CONFIG['uri']}")
        return client
    except ConnectionFailure:
        print(f"[ERR] 无法连接到MongoDB服务器: {CONFIG['uri']}")
        sys.exit(1)
    except ServerSelectionTimeoutError:
        print(f"[ERR] 连接超时: {CONFIG['uri']}")
        print("[HINT] 请检查MongoDB服务是否运行或网络连接是否正常")
        sys.exit(1)

def import_json_files(client):
    """导入JSON文件到MongoDB"""
    # 获取数据库引用
    db = client[CONFIG["db_name"]]
    
    # 检查数据目录是否存在
    if not os.path.exists(CONFIG["data_dir"]):
        print(f"❌ 数据目录不存在: {CONFIG['data_dir']}")
        return False
    
    # 获取所有JSON文件
    json_files = [f for f in os.listdir(CONFIG["data_dir"]) if f.endswith('.json')]

    # 集合名映射（文件名 -> 目标集合名）
    collection_name_map = {
        # 模型 UserAdmin 使用的集合名为 usersadmin（固定）
        'useradmin': 'usersadmin'
    }
    
    if not json_files:
        print(f"❌ 在 {CONFIG['data_dir']} 目录中未找到JSON文件")
        return False
    
    print(f"[INFO] 找到 {len(json_files)} 个JSON文件待导入")
    
    # 导入每个文件
    for file_name in json_files:
        src_name = os.path.splitext(file_name)[0]
        collection_name = collection_name_map.get(src_name, src_name)
        file_path = os.path.join(CONFIG["data_dir"], file_name)
        
        try:
            # 读取JSON文件，兼容MongoDB扩展JSON（$oid/$date 等）
            with open(file_path, 'r', encoding='utf-8') as file:
                raw = file.read()
                try:
                    # 优先使用bson.json_util解析，支持$oid/$date
                    data = json_util.loads(raw)
                except Exception:
                    # 回退到标准json解析
                    data = json.loads(raw)
            
            # 如果配置为删除现有集合，则先删除
            if CONFIG["drop_existing"] and collection_name in db.list_collection_names():
                db[collection_name].drop()
                print(f"[DROP] 已删除现有集合: {collection_name}")
            
            # 导入数据
            if isinstance(data, list):
                if data:  # 确保数据不为空
                    result = db[collection_name].insert_many(data)
                    print(f"[OK] 已导入 {len(result.inserted_ids)} 条记录到 {collection_name} 集合")
                else:
                    print(f"[WARN] 文件 {file_name} 包含空列表，已跳过")
            elif isinstance(data, dict):
                result = db[collection_name].insert_one(data)
                print(f"[OK] 已导入 1 条记录到 {collection_name} 集合")
            else:
                print(f"[WARN] 文件 {file_name} 数据类型不支持，已跳过：{type(data)}")
                
        except json.JSONDecodeError:
            print(f"[ERR] 文件 {file_name} 不是有效的JSON格式")
        except Exception as e:
            print(f"[ERR] 导入 {file_name} 时出错: {str(e)}")
    
    return True

def main():
    """主函数"""
    print("=" * 50)
    print("MongoDB数据导入工具")
    print("=" * 50)
    
    # 连接MongoDB
    client = connect_to_mongodb()
    
    # 导入数据
    success = import_json_files(client)
    
    # 关闭连接
    client.close()
    
    if success:
        print("\n[OK] 导入完成！")
    else:
        print("\n[WARN] 导入过程中出现问题，请检查上方日志。")

if __name__ == "__main__":
    main() 