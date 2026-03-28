export function drawSierpinskiTriangle(gl, n) {
	function midpoint(p1, p2) {
		return {
			x: (p1.x + p2.x) / 2,
			y: (p1.y + p2.y) / 2,
		};
	}

	function subdivide(triangles) {
		let newTriangles = [];

		for (let i = 0; i < triangles.length; i++) {
			const triangle = triangles[i];
			const p1 = triangle[0];
			const p2 = triangle[1];
			const p3 = triangle[2];

			// Lấy trung điểm 3 cạnh để tạo 3 tam giác con ở 3 góc.
			// Tam giác giữa bị bỏ đi chính là "lỗ" Sierpinski.
			const p12 = midpoint(p1, p2);
			const p23 = midpoint(p2, p3);
			const p31 = midpoint(p3, p1);

			newTriangles.push([p1, p12, p31]);
			newTriangles.push([p12, p2, p23]);
			newTriangles.push([p31, p23, p3]);
		}

		return newTriangles;
	}

	function pushEdge(vertices, p1, p2) {
		vertices.push(p1.x, p1.y, p2.x, p2.y);
	}

	// Tam giác đều ban đầu, đủ lớn để hiển thị đẹp trong clip-space.
	let triangles = [
		[
			{ x: 0.0, y: 0.8 },
			{ x: -0.8, y: -0.6 },
			{ x: 0.8, y: -0.6 },
		],
	];

	for (let i = 0; i < n; i++) {
		triangles = subdivide(triangles);
	}

	const vertices = [];
	for (let i = 0; i < triangles.length; i++) {
		const triangle = triangles[i];
		const p1 = triangle[0];
		const p2 = triangle[1];
		const p3 = triangle[2];

		// Dùng GL.LINES nên mỗi cạnh cần truyền thành một cặp điểm riêng.
		pushEdge(vertices, p1, p2);
		pushEdge(vertices, p2, p3);
		pushEdge(vertices, p3, p1);
	}

	const vertexData = new Float32Array(vertices);

	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

	const positionLocation = gl.getAttribLocation(gl.program, "a_position");
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	// Mỗi 2 số float là 1 đỉnh, nên số đỉnh = vertices.length / 2.
	gl.drawArrays(gl.LINES, 0, vertices.length / 2);
}
