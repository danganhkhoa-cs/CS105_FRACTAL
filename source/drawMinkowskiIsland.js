export function drawMinkowskiIsland(gl, n) {
	function generate(points) {
		let newPoints = [];

		for (let i = 0; i < points.length - 1; i++) {
			const p1 = points[i];
			const p2 = points[i + 1];

			// Chia đoạn p1 -> p2 thành 4 phần bằng nhau.
			const dx = (p2.x - p1.x) / 4;
			const dy = (p2.y - p1.y) / 4;

			// (nx, ny) là vector pháp tuyến vuông góc với (dx, dy),
			// dùng để tạo "gờ" nhô ra của Minkowski.
			const nx = -dy;
			const ny = dx;

			// Tạo 8 điểm trung gian thay cho 1 đoạn thẳng ban đầu.
			// Chuỗi điểm này chính là mẫu Minkowski cho mỗi cạnh.
			const pA = p1;
			const pB = { x: p1.x + dx, y: p1.y + dy };
			const pC = { x: pB.x + nx, y: pB.y + ny };
			const pD = { x: p1.x + 2 * dx + nx, y: p1.y + 2 * dy + ny };
			const pE = { x: p1.x + 2 * dx, y: p1.y + 2 * dy };
			const pF = { x: p1.x + 2 * dx - nx, y: p1.y + 2 * dy - ny };
			const pG = { x: p1.x + 3 * dx - nx, y: p1.y + 3 * dy - ny };
			const pH = { x: p1.x + 3 * dx, y: p1.y + 3 * dy };

			newPoints.push(pA, pB, pC, pD, pE, pF, pG, pH);
		}

		// Giữ lại điểm cuối cùng để chuỗi line strip vẫn liên tục.
		newPoints.push(points[points.length - 1]);
		return newPoints;
	}

	// Bắt đầu từ hình vuông (ISLAND)
	let points = [
		{ x: -0.5, y: -0.5 },
		{ x: 0.5, y: -0.5 },
		{ x: 0.5, y: 0.5 },
		{ x: -0.5, y: 0.5 },
		{ x: -0.5, y: -0.5 },
	];

	for (let i = 0; i < n; i++) {
		points = generate(points);
	}

	// Chuyển [{x, y}, ...] sang mảng phẳng [x1, y1, x2, y2, ...]
	// để đưa vào buffer của WebGL.
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

	// Mỗi đỉnh có 2 thành phần float: x, y.
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	// LINE_STRIP giúp nối liên tiếp các điểm để tạo đường biên island.
	gl.drawArrays(gl.LINE_STRIP, 0, points.length);
}
