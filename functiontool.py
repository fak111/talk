# -*- coding: utf-8 -*-
"""
简单的天气查询功能，支持function calling
"""

import os
import json
import requests
from getpass import getpass
from openai import OpenAI

# 不需要预定义城市坐标，让模型自己返回坐标信息

# 定义天气查询工具
WEATHER_TOOLS = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "获取指定城市或坐标的当前温度（摄氏度）",
        "parameters": {
            "type": "object",
            "properties": {
                "latitude": {"type": "number", "description": "纬度"},
                "longitude": {"type": "number", "description": "经度"}
            },
            "required": ["latitude", "longitude"],
            "additionalProperties": False
        },
        "strict": True
    }
}]


def get_weather(latitude, longitude):
    """
    获取指定坐标的天气信息

    Args:
        latitude: 纬度
        longitude: 经度

    Returns:
        当前温度（摄氏度）
    """
    try:
        # 调用开放气象API
        response = requests.get(
            f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
        )
        data = response.json()
        temperature = data['current']['temperature_2m']
        return f"{temperature}"
    except Exception as e:
        return f"获取天气信息时出错: {str(e)}"


def ask_weather(question, model="gpt-3.5-turbo", api_key=None):
    """
    处理天气查询问题

    Args:
        question: 用户的天气查询问题，如"北京天气怎么样？"
        model: 使用的OpenAI模型名称
        api_key: OpenAI API密钥

    Returns:
        回答用户问题的文本
    """
    # 设置API密钥
    if api_key:
        os.environ["OPENAI_API_KEY"] = api_key
    elif "OPENAI_API_KEY" not in os.environ:
        openai_api_key = getpass("🔑 请输入您的OpenAI API密钥: ")
        os.environ["OPENAI_API_KEY"] = openai_api_key

    client = OpenAI()
    messages = [{"role": "user", "content": question}]

    try:
        # 第一次调用API，可能会触发function calling
        completion = client.chat.completions.create(
            model=model,
            messages=messages,
            tools=WEATHER_TOOLS
        )

        assistant_message = completion.choices[0].message

        # 检查是否需要调用函数
        if assistant_message.tool_calls:
            # 处理工具调用
            for tool_call in assistant_message.tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)

                # 调用天气查询函数
                if function_name == "get_weather":
                    function_response = get_weather(**function_args)
                else:
                    function_response = f"未知函数: {function_name}"

                # 将函数调用结果添加到消息历史
                messages.append(assistant_message)
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": function_response
                })

            # 再次调用API获取最终回复
            second_completion = client.chat.completions.create(
                model=model,
                messages=messages,
                tools=WEATHER_TOOLS
            )

            return second_completion.choices[0].message.content

        # 如果不需要调用函数，直接返回助手回复
        return assistant_message.content
    except Exception as e:
        return f"查询失败: {str(e)}"


# 示例用法
if __name__ == "__main__":
    # 预设的API密钥

    # 接受用户输入的问题
    question = input("请输入您的天气查询问题（例如：北京天气怎么样？）: ")

    # 使用预设的API密钥进行查询
    answer = ask_weather(question, api_key=api_key)
    print(f"\n回答: {answer}")


