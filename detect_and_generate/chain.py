from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
import os
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException

class ReportGenerator:
    def __init__(self):
        self.llm = ChatGroq(
            temperature=0,
            groq_api_key="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",
            model_name="llama3-70b-8192"
        )

    def generate_report(self, severity, disease_name):
        prompt = PromptTemplate.from_template(
            """
### INPUT PARAMETERS:  
- Detected Disease: **{disease_name}**  
- Severity Level: **{severity}**  

---

#### OUTPUT TEMPLATE:  

1. **Disease Overview**  
   Provide a detailed paragraph explaining the disease, covering the following aspects:  
   - **Name**: {disease_name}  
   - **Symptoms**: Include the primary symptoms observed in the crops.  
   - **Causes**: Explain what causes this disease (pathogens, environmental factors, etc.).  
   - **Impact**: Describe how the disease affects plant health, yield, and quality.  

   Additionally, summarize the key points in bullet form:  
   - Symptoms:  
     - AI-generated symptoms.  
   - Causes:  
     - AI-generated causes.  
   - Impact:  
     - AI-generated impact.  

2. **Severity Analysis**  
   Provide a paragraph analyzing the severity of the disease, including risks and economic implications:  
   - **Severity Level**: {severity}  
   - **Complications**: Discuss the risks and challenges posed by the disease at this severity level.  
   - **Economic Impact**: Estimate the potential yield losses and financial repercussions.  

   Also, summarize in bullet points:  
   - Risks: AI-generated risks.  
   - Financial Impact: AI-generated economic effects.  

3. **Solutions**  
   Provide a paragraph explaining the solutions for the disease, categorized as follows:  
   - **Organic Solutions**:  
     - Describe effective natural methods such as bio-control agents, cultural practices, or organic fungicides.  

   - **Inorganic Solutions**:  
     - Explain the use of synthetic fungicides or fertilizers to combat the disease effectively.  

   Summarize the solutions in a table:  

| **Type**         | **Product Name**           | **Usage Instructions**                 | **Frequency**       | **Precautions**              |  
|-------------------|----------------------------|----------------------------------------|---------------------|------------------------------|  
| Organic Solution  | AI-generated name         | AI-generated best practices for usage  | AI-generated frequency | AI-generated safety details |  
| Organic Solution  | AI-generated name         | AI-generated best practices for usage  | AI-generated frequency | AI-generated safety details |  
| Inorganic Solution| AI-generated name         | AI-generated instructions for use      | AI-generated frequency | AI-generated safety measures|  
| Inorganic Solution| AI-generated name         | AI-generated instructions for use      | AI-generated frequency | AI-generated safety measures|  

4. **Warnings and Recommendations**  
   Write a paragraph discussing the risks of incorrect solution usage (e.g., resistance development, handling safety), and recommend sustainable farming practices to prevent recurrence.  

   Summarize warnings in bullet points:  
   - Warnings: AI-generated warnings.  
   - Recommendations: AI-generated recommendations.  

---

### AI-GENERATED FINAL REPORT:  
The LLM generates a detailed and structured report using the above format. Each section contains a combination of detailed paragraphs for in-depth explanations and bullet points for quick reference. Specific products, their application methods, frequencies, and precautions are dynamically determined based on the disease and its severity.  

            """
        )

        rendered_prompt = prompt.format(
            disease_name=disease_name,
            severity=severity
        )

        try:
            response = self.llm.invoke(input=rendered_prompt)  # Invoke the LLM with the formatted string
            return response.content  # Return the generated report
        except Exception as e:
            raise Exception("Failed to generate the report. Please check the LLM configuration or response.") from e
