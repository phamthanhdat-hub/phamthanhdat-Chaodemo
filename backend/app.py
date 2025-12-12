from flask import Flask, jsonify, request
import pyodbc
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# =======================
# Kết nối SQL Server
# =======================
def get_connection():
    return pyodbc.connect(
        r"Driver={SQL Server};"
        r"Server=DESKTOP-HD2ANFT\SQLEXPRESS;"
        r"Database=babycutie;"
        r"Trusted_Connection=yes;"
    )

# =======================
# API: Lấy danh sách sản phẩm
# =======================
@app.route('/api/products', methods=['GET'])
def get_products():
    conn, cursor = None, None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        category = request.args.get("category")
        search = request.args.get("search")

        sql = "SELECT * FROM Products WHERE 1=1"
        params = []

        if category and category != "all":
            sql += " AND category_id = ?"
            params.append(category)

        if search:
            sql += " AND (name LIKE ? OR description LIKE ?)"
            search_param = f"%{search}%"
            params.extend([search_param, search_param])

        cursor.execute(sql, params)
        rows = cursor.fetchall()

        products = []
        for row in rows:
            products.append({
                "id": row.id,
                "name": row.name,
                "description": row.description,
                "price": float(row.price),
                "category_id": row.category_id,
                "image": row.image,
                "protein": row.protein,
                "carb": row.carb,
                "fat": row.fat
            })

        return jsonify({"success": True, "data": products})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# =======================
# API: Chi tiết sản phẩm
# =======================
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product_detail(product_id):
    conn, cursor = None, None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Products WHERE id = ?", (product_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"success": False, "message": "Product not found"}), 404

        product = {
            "id": row.id,
            "name": row.name,
            "description": row.description,
            "price": float(row.price),
            "category_id": row.category_id,
            "image": row.image,
            "protein": row.protein,
            "carb": row.carb,
            "fat": row.fat
        }
        return jsonify({"success": True, "data": product})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# =======================
# API: Lấy danh mục
# =======================
@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn, cursor = None, None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Categories")
        rows = cursor.fetchall()
        categories = []
        for row in rows:
            categories.append({
                "id": row.id,
                "name": row.name,
                "description": row.description
            })
        return jsonify({"success": True, "data": categories})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# =======================
# API: Lấy đơn hàng
# =======================
@app.route('/api/orders', methods=['GET'])
def get_orders():
    conn, cursor = None, None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Orders")
        rows = cursor.fetchall()
        orders = []
        for row in rows:
            orders.append({
                "id": row.id,
                "user_id": row.user_id,
                "total": row.total,
                "status": row.status,
                "created_at": str(row.created_at)
            })
        return jsonify({"success": True, "data": orders})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# =======================
# API: Lấy chi tiết đơn hàng
# =======================
@app.route('/api/order-items', methods=['GET'])
def get_order_items():
    conn, cursor = None, None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM OrderItems")
        rows = cursor.fetchall()
        items = []
        for row in rows:
            items.append({
                "id": row.id,
                "order_id": row.order_id,
                "product_id": row.product_id,
                "quantity": row.quantity,
                "price": row.price
            })
        return jsonify({"success": True, "data": items})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# =======================
# API: Lấy liên hệ
# =======================
@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    conn, cursor = None, None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Contacts")
        rows = cursor.fetchall()
        contacts = []
        for row in rows:
            contacts.append({
                "id": row.id,
                "name": row.name,
                "email": row.email,
                "message": row.message,
                "created_at": str(row.created_at)
            })
        return jsonify({"success": True, "data": contacts})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# =======================
# API: Lấy log admin
# =======================
@app.route('/api/admin-logs', methods=['GET'])
def get_admin_logs():
    conn, cursor = None, None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM AdminLogs")
        rows = cursor.fetchall()
        logs = []
        for row in rows:
            logs.append({
                "id": row.id,
                "admin_id": row.admin_id,
                "action": row.action,
                "created_at": str(row.created_at)
            })
        return jsonify({"success": True, "data": logs})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# =======================
# RUN SERVER
# =======================
if __name__ == "__main__":
    app.run(debug=True)
