export function drawKochSnowFlake(gl, n) {

	function koch(points) {
		let newPoints = [];

		for (let i = 0; i < points.length - 1; i++) {
			let p1 = points[i];
			let p2 = points[i + 1];

			let dx = (p2.x - p1.x) / 3;
			let dy = (p2.y - p1.y) / 3;

			let A = { x: p1.x + dx, y: p1.y + dy };
			let B = { x: p1.x + 2 * dx, y: p1.y + 2 * dy };

			// tạo đỉnh tam giác
			let angle = -Math.PI / 3;
			let C = {
				x: A.x + (dx * Math.cos(angle) - dy * Math.sin(angle)),
				y: A.y + (dx * Math.sin(angle) + dy * Math.cos(angle)),
			};

			newPoints.push(p1);
			newPoints.push(A);
			newPoints.push(C);
			newPoints.push(B);
		}

		newPoints.push(points[points.length - 1]);
		return newPoints;
	}

	// ===== TAM GIÁC BAN ĐẦU =====
	let size = 0.8;
	let h = size * Math.sqrt(3) / 2;

	let p1 = { x: -size / 2, y: -h / 2 };
	let p2 = { x:  size / 2, y: -h / 2 };
	let p3 = { x: 0, y: h / 2 };

	// tạo polygon khép kín
	let points = [p1, p2, p3, p1];

	// ===== lặp n lần =====
	for (let i = 0; i < n; i++) {
		points = koch(points);
	}

	let vertices = [];
	for (let i = 0; i < points.length; i++) {
		vertices.push(points[i].x, points[i].y);
	}

	// ===== WebGL =====
	let buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	let pos = gl.getAttribLocation(gl.program, "a_position");
	gl.enableVertexAttribArray(pos);
	gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 2);
}