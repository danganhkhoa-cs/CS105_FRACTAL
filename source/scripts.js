// import { drawKochSnowFlake } from "./drawKochSnowFlake.js";
import { drawMinkowskiIsland } from "./drawMinkowskiIsland.js";
// import { drawSierpinskiTriangle } from "./drawSierpinskiTriangle.js";
// import { drawSierpinskiCarpet } from "./drawSierpinskiCarpet.js";

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

	// 🔥 QUAN TRỌNG NHẤT
	gl.useProgram(program);
	gl.program = program;
	if (!gl) {
		alert("Trình duyệt của bạn không hỗ trợ WebGL!");
		return;
	}

	// Hàm tiện ích: Xóa màn hình canvas về màu nền (xám nhạt)
	function clearCanvas() {
		gl.clearColor(0.95, 0.95, 0.95, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	// Xóa màn hình lần đầu khi tải trang
	clearCanvas();

	// 2. Lắng nghe sự kiện click vào nút "Vẽ Hình"
	document.getElementById("drawBtn").addEventListener("click", () => {
		// Lấy giá trị từ UI
		const type = document.getElementById("fractalType").value;
		const n = parseInt(document.getElementById("iterationN").value, 10);

		// Kiểm tra hợp lệ
		if (isNaN(n) || n < 0) {
			alert("Vui lòng nhập N là một số nguyên không âm!");
			return;
		}

		// Xóa hình cũ trước khi vẽ hình mới
		clearCanvas();

		// 3. Phân luồng chạy thuật toán dựa vào select
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
	});
});
