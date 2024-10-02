from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForCausalLM

app = Flask(__name__)

# Hugging Face에서 텍스트 생성 모델 불러오기 (여기서는 gpt-neo-2.7B 사용)
tokenizer = AutoTokenizer.from_pretrained("EleutherAI/gpt-neo-2.7B")
model = AutoModelForCausalLM.from_pretrained("EleutherAI/gpt-neo-2.7B")

# 보험 계약서 생성 함수
def generate_insurance_contract(customer_data):
    prompt = f"Generate an insurance contract based on the following customer data: {customer_data}"

    # 입력 텍스트를 토큰화하고, 모델을 통해 텍스트 생성
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(inputs['input_ids'], max_length=150, num_return_sequences=1)
    
    # 생성된 텍스트 디코딩
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return generated_text

# Flask API 엔드포인트
@app.route('/generate-contract', methods=['POST'])
def generate_contract():
    data = request.json  # 프론트엔드에서 보내는 JSON 데이터를 받음
    customer_data = data.get('customer_data')
    
    # 보험 계약서 생성
    contract = generate_insurance_contract(customer_data)
    return jsonify({'contract': contract})  # 결과를 JSON으로 반환

if __name__ == '__main__':
    app.run(debug=True)
