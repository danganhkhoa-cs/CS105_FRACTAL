import { drawKochSnowFlake } from "./drawKochSnowFlake.js";
import { drawMinkowskiIsland } from "./drawMinkowskiIsland.js";
import { drawSierpinskiTriangle } from "./drawSierpinskiTriangle.js";
import { drawSierpinskiCarpet } from "./drawSierpinskiCarpet.js";

document.addEventListener("DOMContentLoaded", () => {
	// 1. Lấy canvas và khởi tạo WebGL context
	const canvas = document.getElementById("glcanvas");
	const gl =
		canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

	// ===== SHADER =====
	const vertexShaderSource = `
	attribute vec2 a_position;
	void main() {
		gl_Position = vec4(a_position, 0.0, 1.0);
	}
	`;

	const fragmentShaderSource = `
	precision mediump float;
	void main() {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
	`;

	function createShader(gl, type, source) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		return shader;
	}

	const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	const program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);

	gl.useProgram(program);
	gl.program = program;
	if (!gl) {
		alert("Trình duyệt của bạn không hỗ trợ WebGL");
		return;
	}

	// Hàm tiện ích: Xóa màn hình canvas về màu nền (xám nhạt)
	function clearCanvas() {
		gl.clearColor(0.95, 0.95, 0.95, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	// Xóa màn hình lần đầu khi tải trang
	clearCanvas();

	const fractalTypeSelect = document.getElementById("fractalType");
	const iterationInput = document.getElementById("iterationN");
	const iterationValue = document.getElementById("iterationNValue");

	function renderFractal() {
		const type = fractalTypeSelect.value;
		const n = parseInt(iterationInput.value, 10);

		if (isNaN(n) || n < 0) {
			alert("Vui lòng nhập N là một số nguyên không âm!");
			return;
		}

		clearCanvas();

		switch (type) {
			case "koch":
				drawKochSnowFlake(gl, n);
				break;
			case "minkowski":
				drawMinkowskiIsland(gl, n);
				break;
			case "sierpinski_triangle":
				drawSierpinskiTriangle(gl, n);
				break;
			case "sierpinski_carpet":
				drawSierpinskiCarpet(gl, n);
				break;
			default:
				console.error("Loại fractal không được hỗ trợ.");
		}
	}

	// Lắng nghe giá trị của thanh trượt và vẽ
	iterationInput.addEventListener("input", () => {
		iterationValue.textContent = iterationInput.value;
		renderFractal();
	});

	// Khi đổi loại fractal: đặt mặc định N = 0 và vẽ ngay.
	fractalTypeSelect.addEventListener("change", () => {
		iterationInput.value = "0";
		iterationValue.textContent = "0";
		renderFractal();
	});

	// Vẽ mặc định ban đầu tại N = 0.
	iterationInput.value = "0";
	iterationValue.textContent = "0";
	renderFractal();
});
