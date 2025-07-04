import psycopg2

conn_str = "postgresql://postgres:#Toshlewi254@aqwuidlalxfpkrvmvdon.postgres.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(conn_str)
    print("✅ Connected to Supabase Postgres!")
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
    """)
    tables = cur.fetchall()
    print("Tables in your database:")
    for table in tables:
        print("-", table[0])
    cur.close()
    conn.close()
except Exception as e:
    print("❌ Could not connect or query tables.")
    print("Error:", e) 