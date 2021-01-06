import pos from './constant/pos';
import tag from './constant/tag';
import dep from './constant/dep_en';
// import axios from 'axios';

export const nlp = async (text) => {
  // 本地调试
  // const path = require('path');
  // const child_process = require('child_process');
  // const result = child_process.execSync(
  //   `python3 ${path.join(process.cwd(), 'lib/parse/en.py')} "${text}"`,
  //   { encoding: 'utf8' }
  // );

  const result = await fetch(
    `https://service-h8zwnbuw-1254074572.gz.apigw.tencentcs.com/release?text=${text}`
  ).then((raw) => raw.json());

  // const { data: result } = await axios.get(
  //   `https://service-h8zwnbuw-1254074572.gz.apigw.tencentcs.com/release?text=${text}`
  // );

  const nlpData = JSON.parse(result);
  nlpData.words = nlpData.words.map((it) => {
    return {
      ...it,
      tag_obj: pos[it.tag],
      tag_extend_obj: tag[it.tag_extend],
    };
  });

  nlpData.arcs = nlpData.arcs.map((it) => {
    return {
      ...it,
      label_obj: dep[it.label] || {},
    };
  });

  return nlpData;
};
