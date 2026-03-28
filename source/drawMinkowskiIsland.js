export function drawMinkowskiIsland(gl, n) {
	//console.log(`Đang chạy Minkowski với N = ${n}`);
	//console.log("program:", gl.program);
	function generate(points) {
		let newPoints = [];

		for (let i = 0; i < points.length - 1; i++) {
			const p1 = points[i];
			const p2 = points[i + 1];

			const dx = (p2.x - p1.x) / 4;
			const dy = (p2.y - p1.y) / 4;

			const nx = -dy;
			const ny = dx;

			const pA = p1;
			const pB = { x: p1.x + dx, y: p1.y + dy };
			const pC = { x: pB.x + nx, y: pB.y + ny };
			const pD = { x: p1.x + 2 * dx + nx, y: p1.y + 2 * dy + ny };
			const pE = { x: p1.x + 2 * dx, y: p1.y + 2 * dy };
			const pF = { x: p1.x + 2 * dx - nx, y: p1.y + 2 * dy - ny };
			const pG = { x: p1.x + 3 * dx - nx, y: p1.y + 3 * dy - ny };
			const pH = { x: p1.x + 3 * dx, y: p1.y + 3 * dy };
			const pI = p2;

			newPoints.push(pA, pB, pC, pD, pE, pF, pG, pH);
		}

		newPoints.push(points[points.length - 1]);
		return newPoints;
	}

	// 🔥 Bắt đầu từ hình vuông (ISLAND)
	let points = [
		{ x: -0.5, y: -0.5 },
		{ x:  0.5, y: -0.5 },
		{ x:  0.5, y:  0.5 },
		{ x: -0.5, y:  0.5 },
		{ x: -0.5, y: -0.5 }
	];

	for (let i = 0; i < n; i++) {
		points = generate(points);
	}

	// ===== Convert =====
	const vertices = [];
	for (let p of points) {
		vertices.push(p.x, p.y);
	}

	const vertexData = new Float32Array(vertices);

	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

	const positionLocation = gl.getAttribLocation(gl.program, "a_position");
	gl.enableVertexAttribArray(positionLocation);

	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	// 🔥 QUAN TRỌNG
	gl.drawArrays(gl.LINE_STRIP, 0, points.length);
}