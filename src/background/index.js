import './_env';
import { bluesea } from '../logic';
import './csp';
import { nlp } from './nlp';
import { user } from '../io';
import '../store'

user.login(null, { auto: false });

// 首次安装或者更新
chrome.runtime.onInstalled.addListener(() => {});

