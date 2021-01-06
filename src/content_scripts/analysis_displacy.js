import React from 'react';

export const Displacy = ({ parse }) => {
  const distance = 160;
  const offsetX = 66;
  const wordSpacing = 60;
  const arrowSpacing = 10;
  const arrowStroke = 2;
  const arrowWidth = 6;

  const font = 'inherit';
  const color = '#ffffff';
  const bg = '#272822';

  const levels = [
    ...new Set(
      parse.arcs.map(({ end, start }) => end - start).sort((a, b) => a - b)
    ),
  ];
  const highestLevel = levels.indexOf(levels.slice(-1)[0]) + 1;
  const offsetY = (distance / 2) * highestLevel;
  const width = offsetX + parse.words.length * distance;
  const height = offsetY + 3 * wordSpacing;

  const renderWords = (words) => {
    return words.map(
      ({ text, tag, tag_obj, tag_extend, tag_extend_obj }, i) => {
        return (
          <text
            key={i}
            className="displacy-token"
            fill="currentColor"
            data-tag={tag}
            textAnchor="middle"
            y={offsetY + wordSpacing}
          >
            <tspan
              className="displacy-word"
              x={offsetX + i * distance}
              fill="currentColor"
              data-tag={tag}
            >
              {text}
            </tspan>
            <tspan
              className="displacy-tag"
              x={offsetX + i * distance}
              dy="2em"
              fill="currentColor"
              data-tag={tag}
            >
              {tag_obj.DESCRIPTION_zh}
              <tspan style={{ fontSize: '0.6em' }}>({tag})</tspan>
            </tspan>
            <tspan
              className="displacy-tag"
              x={offsetX + i * distance}
              dy="2em"
              fill="currentColor"
              data-tag={tag_extend}
            >
              {tag_extend_obj.DESCRIPTION_zh}
              <tspan style={{ fontSize: '0.6em' }}>({tag_extend})</tspan>
            </tspan>
          </text>
        );
      }
    );
  };

  const renderArrows = (arcs) => {
    return arcs.map(({ label, end, start, dir, label_obj }, i) => {
      const rand = Math.random().toString(36).substr(2, 8);
      const level = levels.indexOf(end - start) + 1;
      const startX =
        offsetX +
        start * distance +
        (arrowSpacing * (highestLevel - level)) / 4;
      const startY = offsetY;
      const endpoint =
        offsetX +
        (end - start) * distance +
        start * distance -
        (arrowSpacing * (highestLevel - level)) / 4;

      let curve = offsetY - (level * distance) / 2;
      if (curve == 0 && levels.length > 5) {
        curve = -distance;
      }
      return (
        <g className="displacy-arrow" data-dir={dir} data-label={label} key={i}>
          <path
            id={`arrow-${rand}`}
            className="displacy-arc"
            d={`M${startX},${startY} C${startX},${curve} ${endpoint},${curve} ${endpoint},${startY}`}
            strokeWidth={arrowStroke + 'px'}
            fill="none"
            stroke="currentColor"
            data-dir={dir}
            data-label={label}
          ></path>
          <text dy="1em">
            <textPath
              xlinkHref={'#arrow-' + rand}
              className="displacy-label"
              startOffset="50%"
              fill="currentColor"
              textAnchor="middle"
              data-label={label}
              data-dir={dir}
            >
              {label_obj.DESCRIPTION_zh}
            </textPath>
          </text>
          <path
            className="displacy-arrowhead"
            d={`M${dir == 'left' ? startX : endpoint},${startY + 2} L${
              dir == 'left'
                ? startX - arrowWidth + 2
                : endpoint + arrowWidth - 2
            },${startY - arrowWidth} ${
              dir == 'left'
                ? startX + arrowWidth - 2
                : endpoint - arrowWidth + 2
            },${startY - arrowWidth}`}
            fill="currentColor"
            data-label={label}
            data-dir={dir}
          ></path>
        </g>
      );
    });
  };

  return (
    <svg
      className="displacy"
      id="displacy-svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMinYMax meet"
      data-format="spacy"
      style={{
        color,
        background: bg,
        fontFamily: font,
      }}
    >
      {renderWords(parse.words)}
      {renderArrows(parse.arcs)}
    </svg>
  );
};
