import streamlit as st
from chain import ReportGenerator  # Import your ReportGenerator class

# Create the Streamlit app
def main():
    st.title("🌾 Crop Disease Report Generator")
    st.write(
        "Generate a comprehensive report for crop diseases with details on severity, solutions, and yield effects."
    )

    # Input fields for disease details
    disease_name = st.text_input("Enter the disease name:", placeholder="e.g., TLB (Turcicum Leaf Blight)")
    severity = st.selectbox(
        "Select the severity level of the disease:",
        ["mild", "moderate", "severe"]
    )
    
    # Button to generate the report
    if st.button("Generate Report"):
        if not disease_name:
            st.error("Please enter a valid disease name.")
        else:
            # Initialize the ReportGenerator and generate the report
            generator = ReportGenerator()
            try:
                report = generator.generate_report(
                    severity=severity,
                    disease_name=disease_name
                )
                st.subheader("Generated Report:")
                st.text_area("Report Output:", value=report, height=400)
                st.success("Report generated successfully!")

                if st.button("Generate PDF Report"):
                    from io import BytesIO
                    from reportlab.lib.pagesizes import letter
                    from reportlab.pdfgen import canvas

                    try:
                        # Create a BytesIO buffer
                        buffer = BytesIO()

                        # Generate PDF
                        c = canvas.Canvas(buffer, pagesize=letter)
                        c.setFont("Helvetica-Bold", 14)
                        c.drawString(50, 750, f"Crop Disease Report: {disease_name}")
                        c.setFont("Helvetica", 10)

                        # Prepare multi-line text for PDF
                        y_position = 700  # Start writing text lower on the page
                        line_height = 15  # Line spacing
                        for line in report.splitlines():
                            c.drawString(50, y_position, line)
                            y_position -= line_height
                            if y_position < 50:  # Add a new page if text exceeds one page
                                c.showPage()
                                c.setFont("Helvetica", 10)
                                y_position = 750

                        # Finalize PDF
                        c.save()

                        # Return buffer to the start
                        buffer.seek(0)

                        # Display a download button
                        st.download_button(
                            label="Download Report as PDF",
                            data=buffer,
                            file_name=f"{disease_name}_report.pdf",
                            mime="application/pdf"
                        )
                    except Exception as e:
                        st.error(f"An error occurred while creating the PDF: {e}")

            except Exception as e:
                    st.error(f"An error occurred while generating the report: {e}")

if __name__ == "__main__":
    st.set_page_config(layout="wide", page_title="Crop Disease Report Generator", page_icon="🌾")
    main()
