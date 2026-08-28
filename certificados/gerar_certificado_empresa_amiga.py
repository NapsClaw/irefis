from __future__ import annotations

import argparse
from datetime import date
from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "certificados" / "emitidos"
LOGO = ROOT / "logo-novo.jpg"

NAVY = HexColor("#10235C")
BLUE = HexColor("#0A4D9B")
CYAN = HexColor("#21C6D8")
GREEN = HexColor("#69C95A")
GOLD = HexColor("#E7C86B")
INK = HexColor("#193552")
MUTED = HexColor("#526D82")
PAPER = HexColor("#F8FCFF")


def draw_wrapped(c: canvas.Canvas, text: str, style: ParagraphStyle, x: float, y: float, width: float) -> float:
    paragraph = Paragraph(text, style)
    _, height = paragraph.wrap(width, 10 * cm)
    paragraph.drawOn(c, x, y - height)
    return y - height


def make_certificate(company: str, cnpj: str, valid_from: str, valid_until: str, certificate_id: str, signer: str, signer_role: str, output: Path) -> None:
    width, height = landscape(A4)
    c = canvas.Canvas(str(output), pagesize=(width, height))
    c.setTitle(f"Certificado Empresa Amiga do IREFIS — {company}")
    c.setAuthor("IREFIS — Instituto de Reabilitação Fisiot em Saúde")

    c.setFillColor(PAPER)
    c.rect(0, 0, width, height, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.rect(0, height - 3.1 * cm, width, 3.1 * cm, fill=1, stroke=0)
    c.setFillColor(BLUE)
    c.rect(0, 0, width, 1.15 * cm, fill=1, stroke=0)

    c.setStrokeColor(CYAN)
    c.setLineWidth(1.3)
    c.roundRect(0.95 * cm, 0.95 * cm, width - 1.9 * cm, height - 1.9 * cm, 0.45 * cm, fill=0, stroke=1)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.55)
    c.roundRect(1.25 * cm, 1.25 * cm, width - 2.5 * cm, height - 2.5 * cm, 0.35 * cm, fill=0, stroke=1)

    if "AAAA" in certificate_id or "NOME DA EMPRESA" in company.upper():
        c.saveState()
        c.translate(width / 2, height / 2)
        c.rotate(28)
        c.setFillColor(Color(0.06, 0.14, 0.36, alpha=0.09))
        c.setFont("Helvetica-Bold", 38)
        c.drawCentredString(0, 0, "MODELO — SEM VALIDADE")
        c.restoreState()

    if LOGO.exists():
        c.drawImage(str(LOGO), 1.7 * cm, height - 2.62 * cm, width=1.8 * cm, height=1.8 * cm, preserveAspectRatio=True, mask="auto")
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(3.75 * cm, height - 1.42 * cm, "IREFIS")
    c.setFont("Helvetica", 7.5)
    c.drawString(3.75 * cm, height - 1.82 * cm, "Instituto de Reabilitação Fisiot em Saúde")

    styles = getSampleStyleSheet()
    label = ParagraphStyle("label", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=11, alignment=TA_CENTER, textColor=BLUE, spaceAfter=0)
    title = ParagraphStyle("title", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=25, leading=30, alignment=TA_CENTER, textColor=NAVY)
    subtitle = ParagraphStyle("subtitle", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=16, leading=20, alignment=TA_CENTER, textColor=CYAN)
    body = ParagraphStyle("body", parent=styles["Normal"], fontName="Helvetica", fontSize=11, leading=17, alignment=TA_CENTER, textColor=INK)
    company_style = ParagraphStyle("company", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=21, leading=26, alignment=TA_CENTER, textColor=BLUE)
    small = ParagraphStyle("small", parent=styles["Normal"], fontName="Helvetica", fontSize=8.2, leading=11, alignment=TA_CENTER, textColor=MUTED)

    y = height - 4.15 * cm
    y = draw_wrapped(c, "RESPONSABILIDADE SOCIAL", label, 4.3 * cm, y, width - 8.6 * cm) - 0.15 * cm
    y = draw_wrapped(c, "CERTIFICADO", title, 4.3 * cm, y, width - 8.6 * cm)
    y = draw_wrapped(c, "Empresa Amiga do IREFIS", subtitle, 4.3 * cm, y - 0.1 * cm, width - 8.6 * cm) - 0.3 * cm
    y = draw_wrapped(c, "Certificamos que", body, 4.3 * cm, y, width - 8.6 * cm) - 0.05 * cm
    y = draw_wrapped(c, company, company_style, 3.4 * cm, y, width - 6.8 * cm) - 0.1 * cm
    y = draw_wrapped(c, f"CNPJ: {cnpj}", body, 4.3 * cm, y, width - 8.6 * cm) - 0.22 * cm
    text = (
        "integra o programa <b>Empresa Amiga do IREFIS</b>, contribuindo para a manutenção "
        "do serviço Leva e Traz, dos custos do motorista e das ações de manutenção do Instituto. "
        "Esta parceria fortalece a reabilitação, a saúde e a inclusão em Lagoa Santa e região."
    )
    y = draw_wrapped(c, text, body, 4.1 * cm, y, width - 8.2 * cm) - 0.3 * cm

    box_y = 4.0 * cm
    box_w = 9.6 * cm
    box_x = (width - box_w) / 2
    c.setFillColor(Color(0.13, 0.78, 0.85, alpha=0.12))
    c.roundRect(box_x, box_y, box_w, 1.45 * cm, 0.25 * cm, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawCentredString(width / 2, box_y + 0.92 * cm, "VALIDADE DO CERTIFICADO")
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(width / 2, box_y + 0.48 * cm, f"{valid_from}  a  {valid_until}")

    c.setStrokeColor(MUTED)
    c.setLineWidth(0.45)
    sign_y = 2.45 * cm
    c.line(4.0 * cm, sign_y, 11.6 * cm, sign_y)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(7.8 * cm, sign_y - 0.42 * cm, signer)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.5)
    c.drawCentredString(7.8 * cm, sign_y - 0.78 * cm, signer_role)

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(1.65 * cm, 0.43 * cm, f"Certificado nº {certificate_id}")
    c.drawRightString(width - 1.65 * cm, 0.43 * cm, "CNPJ IREFIS: 68.387.204/0001-60")
    c.save()


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera certificado Empresa Amiga do IREFIS")
    parser.add_argument("--empresa", required=True)
    parser.add_argument("--cnpj", required=True)
    parser.add_argument("--inicio", required=True, help="Ex.: 28/08/2026")
    parser.add_argument("--validade", required=True, help="Ex.: 27/08/2027")
    parser.add_argument("--certificado", required=True, help="Ex.: EAI-2026-001")
    parser.add_argument("--assinante", required=True)
    parser.add_argument("--cargo", required=True)
    parser.add_argument("--saida", type=Path)
    args = parser.parse_args()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = args.saida or OUTPUT_DIR / f"certificado-{args.certificado}.pdf"
    make_certificate(args.empresa, args.cnpj, args.inicio, args.validade, args.certificado, args.assinante, args.cargo, output)
    print(output)


if __name__ == "__main__":
    main()
