import json
import openpyxl
import os

def excel_a_json(excel_file, json_file):
    wb = openpyxl.load_workbook(excel_file)
    ws = wb.active

    productos = []

    for row in ws.iter_rows(min_row=2, values_only=True):
        id_producto, nombre, fabricante, clase, detalles, precio, stock = row
        
        # Creamos una lista de imágenes (puedes ajustar el número de imágenes según lo que necesites)
        imagenes_url = [
            f"",
            f"",
            f""
        ]

        producto = {
            "id": id_producto,
            "nombre": nombre,
            "fabricante": fabricante,
            "clase": clase,
            "detalles": detalles,
            "precio": precio,
            "stock": stock,
            "imagenes_url": imagenes_url,  # Ahora es una lista, no un solo string
            "disponible": stock > 0
        }

        productos.append(producto)

    # Asegurarse que el directorio exista
    os.makedirs(os.path.dirname(json_file), exist_ok=True)

    # Guardamos el JSON
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(productos, f, indent=4, ensure_ascii=False)

    print(f"Archivo {json_file} generado correctamente.")

# Ejecuta la función con el archivo 'items.xlsx'
excel_a_json('items.xlsx', 'data/productos.json')
