import fs from 'fs/promises';
import fetch from 'node-fetch';
import Blob from 'fetch-blob';
import { ROI } from './RawImage.js';
import { FormData } from 'formdata-polyfill/esm.min.js';
import randomString from './RandomString.js';

export const DEFAULT_COUNTRY_CODE = 'us';

export default class OpenALPRDetect {
	#url = null;
	#countryCode = null;
	#pattern = null;

	constructor(url, countryCode, pattern = null) {
		
		this.url = url;
		this.countryCode = countryCode;
		this.pattern = pattern;
	}
	get url() {
		return this.#url;
	}
	set url(v) {
		if(!(v instanceof URL))
			throw new TypeError('url must be an instance of URL.');
		this.#url = v;
	}
	get countryCode() {
		return this.#countryCode;
	}
	set countryCode(v) {
		if(typeof v !== 'string')
			throw new TypeError('countryCode must be a string.');
		this.#countryCode = v;
	}
	get pattern() {
		return this.#pattern;
	}
	set pattern(v) {
		if(v !== null && typeof v !== 'string')
			throw new TypeError('pattern must be a string.');
		this.#pattern = v;
	}
	async detect(rawImage) {
		const formData  = new FormData();
		const input_image = await rawImage.toJpegBuffer();
		const posted_image = new Blob([input_image]);

		//jpf Write files being posted to local disk
		//jpf const filePath = `/app/data/posts/${randomString(8)}.jpeg`;
		//jpf await fs.writeFile(filePath, input_image);

		formData.append('upload', posted_image);
		formData.append('country_code', this.countryCode);
		if (this.pattern !== null) formData.append('pattern', this.pattern);
		
		console.log(`  Sending image to: ${this.#url.href}`);
		const response = await fetch(this.#url.href, {
			method: 'POST',
			body: formData
		});

		if(response.status !== 200)
			throw new Error(await response.json());

		const data = await response.json();

		for(const result of data.results) {
			const rect = result.coordinates.reduce((prev, curr) => {
				const left = (prev.left === -1 || curr.x < prev.left) ? curr.x : prev.left;
				const top = (prev.top === -1 || curr.y < prev.top) ? curr.y : prev.top;
				prev.left = left < 0 ? 0 : left;
				prev.top = top < 0 ? 0 : top;

				const width = curr.x - prev.left > prev.width ? curr.x - prev.left : prev.width;
				const height = curr.y - prev.top > prev.height ? curr.y - prev.top : prev.height;
				prev.width = width + prev.left > rawImage.width ? rawImage.width - prev.left : width;
				prev.height = height + prev.top > rawImage.height ? rawImage.height - prev.top : height;

				return prev;
			}, { left: -1, top: -1, width: 0, height: 0 });

			//jpf const roi = ROI.fromObject(rect);
			//jpf const img = await rawImage.roi(roi);
			//jpf const buff = await img.toJpegBuffer();
			//jpf await rawImage.crop(roi);
			//jpf result.jpeg = buff;
			result.jpeg = input_image;
		}

		return data;
	}
	static fromObject(config) {
		if(config === null || typeof config !== 'object')
			throw new TypeError('config must be an Object.');
		return new this(
			new URL(config.url),
			config.countryCode || DEFAULT_COUNTRY_CODE,
			config.pattern
		);
	}
}
