import React from 'react';

/**
 * Intelligent Math & Formula Renderer Component
 * Converts statistical formula text into textbook-grade mathematical typography
 * Handles: Subscripts (e.g. M_hi -> M_hi), Fractions (e.g. (1 / n_h) -> 1/n_h), Math Variables & Operators (×, ÷)
 */
export default function MathFormattedText({ text, style = {}, inline = true }) {
  if (!text) return null;

  // Function to format math tokens within a text string
  const parseMathInText = (str) => {
    // Split text by space or punctuation while preserving math structures
    const tokens = str.split(' ');

    return tokens.map((token, idx) => {
      // Check if token contains fractions like (1 / n_h) or (Z_h / z_hi)
      if (token.includes('/') && !token.includes('http') && !token.includes('https')) {
        const parts = token.replace(/^\(/, '').replace(/\)$/, '').split('/');
        if (parts.length === 2) {
          return (
            <span key={idx} className="math-fraction-box" style={{ margin: '0 4px' }}>
              <span className="math-frac-num">{renderToken(parts[0].trim())}</span>
              <span className="math-frac-line" />
              <span className="math-frac-den">{renderToken(parts[1].trim())}</span>
            </span>
          );
        }
      }

      return (
        <React.Fragment key={idx}>
          {renderToken(token)}
          {idx < tokens.length - 1 ? ' ' : ''}
        </React.Fragment>
      );
    });
  };

  // Helper to render individual token with subscripts and math symbols
  const renderToken = (tok) => {
    // Replace operators
    let cleanTok = tok.replace(/\*/g, ' × ').replace(/<=/g, ' ≤ ').replace(/>=/g, ' ≥ ');

    // Handle subscript notation like M_hi, Z_h, z_hi, n_h, M_hi, M_h, Y_hi
    if (cleanTok.includes('_')) {
      const parts = cleanTok.split('_');
      const base = parts[0];
      const sub = parts[1];

      // Clean non-alphanumeric trailing punctuation from subscript
      const subMatch = sub.match(/^([a-zA-Z0-9]+)(.*)$/);
      if (subMatch) {
        return (
          <span className="math-var-group" key={cleanTok}>
            <span className="math-var-base">{base}</span>
            <sub className="math-var-sub">{subMatch[1]}</sub>
            <span>{subMatch[2]}</span>
          </span>
        );
      }
    }

    // Check if token is a math variable name like (M_hi), PPSWR, FSU, GVA, GVO, CPI
    if (/^[A-Za-z]+[0-9]*$/.test(cleanTok) && (cleanTok.length <= 4 || cleanTok === 'PPSWR' || cleanTok === 'SRSWOR' || cleanTok === 'PPSWR')) {
      if (['M', 'Z', 'z', 'n', 'Y', 'y', 'X', 'x', 'h', 'i', 'k', 'Q1', 'Q3', 'IQR'].includes(cleanTok)) {
        return <span key={cleanTok} className="math-var-single">{cleanTok}</span>;
      }
    }

    return cleanTok;
  };

  const WrapperTag = inline ? 'span' : 'div';

  return (
    <WrapperTag className="math-formatted-container" style={{ display: inline ? 'inline-flex' : 'flex', alignItems: 'baseline', flexWrap: 'wrap', ...style }}>
      {parseMathInText(text)}
    </WrapperTag>
  );
}
