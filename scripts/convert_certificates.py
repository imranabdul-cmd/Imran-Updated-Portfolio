import os
import shutil
import fitz # PyMuPDF

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cert_dir = os.path.join(root_dir, "Certificates")
    photos_dir = os.path.join(root_dir, "Photos")
    
    out_cert_dir = os.path.join(root_dir, "public", "assets", "certificates")
    out_photos_dir = os.path.join(root_dir, "public", "assets", "photos")
    
    os.makedirs(out_cert_dir, exist_ok=True)
    os.makedirs(out_photos_dir, exist_ok=True)
    
    # 1. Copy photos
    if os.path.exists(photos_dir):
        for photo in os.listdir(photos_dir):
            src = os.path.join(photos_dir, photo)
            dst = os.path.join(out_photos_dir, photo)
            shutil.copy2(src, dst)
            print(f"Copied photo: {photo} -> {dst}")

    # 2. Convert certificates
    if os.path.exists(cert_dir):
        for pdf_file in os.listdir(cert_dir):
            if pdf_file.lower().endswith(".pdf"):
                pdf_path = os.path.join(cert_dir, pdf_file)
                doc = fitz.open(pdf_path)
                if len(doc) > 0:
                    page = doc[0]
                    # Render with 2.5x resolution for ultra-crisp display
                    pix = page.get_pixmap(dpi=200)
                    base_name = os.path.splitext(pdf_file)[0]
                    clean_name = base_name.replace(" ", "_").replace("-", "_").lower()
                    img_path = os.path.join(out_cert_dir, f"{clean_name}.png")
                    pix.save(img_path)
                    print(f"Converted {pdf_file} -> {img_path}")
                doc.close()

if __name__ == "__main__":
    main()
