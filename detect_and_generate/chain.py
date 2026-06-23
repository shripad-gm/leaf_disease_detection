from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
import os
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException

class ReportGenerator:
    def __init__(self):
        self.llm = ChatGroq(
            temperature=0,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.3-70b-versatile"
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
            raise Exception(f"AI Error: {str(e)}")


class FertilizerRecommender:
    def __init__(self):
        self.llm = ChatGroq(
            temperature=0,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.3-70b-versatile"
        )

    def generate_recommendation(self, soil_temp, soil_humidity, soil_moisture, azote, phosphorous, potassium, soil_type, crop_type):
        prompt = PromptTemplate.from_template(
            """
Context soil parameters for reasoning (Do NOT output the input parameters, their values, or the 'INPUT PARAMETERS' section in your response. Start directly with the '1. Soil Analysis & Diagnosis' section):
- Crop Type: **{crop_type}**
- Soil Type: **{soil_type}**
- Soil Temperature: **{soil_temp}°C**
- Soil Humidity: **{soil_humidity}%**
- Soil Moisture: **{soil_moisture}%**
- Nitrogen (Azote/N): **{azote} g**
- Phosphorus (P): **{phosphorous} g**
- Potassium (K): **{potassium} g**

---

1. **Soil Analysis & Diagnosis**
   Provide a detailed paragraph analyzing the input parameters. Assess whether the Nitrogen, Phosphorus, and Potassium (N-P-K) levels and soil conditions are Deficient, Optimal, or Excess for growing {crop_type} in {soil_type} soil.
   - N-P-K Status: AI-generated assessment of nutrient levels.
   - Soil Condition: AI-generated assessment of moisture, temperature, and humidity.

2. **Fertilizer Recommendation**
   Provide a detailed paragraph recommending specific fertilizers (organic or inorganic, e.g., Urea, DAP, MOP, compost) to correct any deficiencies or maintain healthy levels.
   - Recommending specific fertilizers: AI-generated recommendation.

   Summarize the fertilizer application in a table:

| **Fertilizer Name** | **Type (Organic/Chemical)** | **Recommended Dosage** | **Application Method** | **Timing/Frequency** |
|---------------------|-----------------------------|------------------------|-------------------------|----------------------|
| AI-generated name   | AI-generated type           | AI-generated dose      | AI-generated method     | AI-generated frequency |

3. **Sustainable Agriculture Tips**
   Provide bullet points with best practices for maintaining long-term soil health and maximizing yield:
   - AI-generated tips for sustainable management.
   - Safety and precautions when applying chemical fertilizers.

            """
        )

        rendered_prompt = prompt.format(
            crop_type=crop_type,
            soil_type=soil_type,
            soil_temp=soil_temp,
            soil_humidity=soil_humidity,
            soil_moisture=soil_moisture,
            azote=azote,
            phosphorous=phosphorous,
            potassium=potassium
        )

        try:
            response = self.llm.invoke(input=rendered_prompt)
            return response.content
        except Exception as e:
            raise Exception(f"AI Error: {str(e)}")

