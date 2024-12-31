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
        self.solutions = {
            "TLB": {
                "organic": [
                    "Neem oil spray every 7 days.",
                    "Crop rotation with legumes to reduce spore buildup.",
                    "Garlic extract spray as a natural fungicide."
                ],
                "inorganic": [
                    "Fungicide containing Mancozeb or Propiconazole.",
                    "Seed treatment with metalaxyl-based fungicides.",
                    "Foliar spray of Carbendazim."
                ]
            },
            "Rust": {
                "organic": [
                    "Spray with compost tea or seaweed extract.",
                    "Encourage good air circulation by proper spacing."
                ],
                "inorganic": [
                    "Use sulfur-based fungicides.",
                    "Spray with fungicides containing Azoxystrobin."
                ]
            }
        }

    def generate_report(self, severity, disease_name):
       
        organic_solutions = self.solutions.get(disease_name.upper(), {}).get("organic", [])
        inorganic_solutions = self.solutions.get(disease_name.upper(), {}).get("inorganic", [])

        
        prompt = PromptTemplate.from_template(
            """
            ### DISEASE REPORT GENERATION
            The detected disease is: {disease_name}.
            Severity level: {severity}.
            
            1. **Disease Details**:
            Provide detailed information about the disease, including symptoms, causes, and how it affects the plant.
            
            2. **Yield Effects**:
            Explain how the disease impacts crop yield and potential economic losses.
            
            3. **Solutions**:
            Provide the best possible solutions:
                - **Organic Solutions**: {organic_solutions}.
                - **Inorganic Solutions**: {inorganic_solutions}.
            
            ### GENERATED REPORT:
            """
        )

        
        rendered_prompt = prompt.format(
            disease_name=disease_name,
            severity=severity,
            organic_solutions=", ".join(organic_solutions),
            inorganic_solutions=", ".join(inorganic_solutions),
        )

        try:
            response = self.llm.invoke(input=rendered_prompt)  # Invoke the LLM with the formatted string
            return response.content  # Return the generated report
        except Exception as e:
            raise Exception("Failed to generate the report. Please check the LLM configuration or response.") from e