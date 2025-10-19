// src/components/FAQPage.js

import React from 'react';
import { faqData } from '../faqData';
import './FAQPage.css'; // Стили мы создадим на следующем шаге

const FAQPage = ({ onBack }) => {
  return (
    <div className="faq-page">
      <header className="faq-header">
        <button onClick={onBack} className="back-button">&larr; Назад к редактору</button>
        <h1>Справка по блокам (FAQ)</h1>
      </header>

      <div className="faq-content">
        <nav className="faq-nav">
          <h3>Категории</h3>
          <ul>
            {faqData.map(categoryData => (
              <li key={categoryData.category}>
                <a href={`#${categoryData.category}`}>{categoryData.category}</a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="faq-main">
          {faqData.map(categoryData => (
            <section key={categoryData.category} id={categoryData.category} className="faq-category">
              <h2>{categoryData.category}</h2>
              {categoryData.blocks.map(block => (
                <div key={block.id} className="faq-block">
                  <h3>{block.title}</h3>
                  <img src={block.image} alt={block.title} className="block-screenshot" />
                  <p className="block-description">{block.description}</p>
                  
                  <h4>Входы (что подключать):</h4>
                  <ul>
                    {block.inputs.map(input => (
                      <li key={input.name}>
                        <strong>{input.name}:</strong> ({input.type}) - {input.description}
                      </li>
                    ))}
                  </ul>

                  <h4>Выход (что отдаёт):</h4>
                  <p>
                    <strong>Тип:</strong> {block.output.type} <br />
                    {block.output.description}
                  </p>

                  <h4>Пример использования:</h4>
                  <p>{block.example.text}</p>
                  {block.example.image && (
                      <img src={block.example.image} alt="Пример использования" className="block-screenshot-example" />
                  )}

                  <h4>Что получается в коде C#:</h4>
                  <pre><code>{block.code_example}</code></pre>
                </div>
              ))}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default FAQPage;