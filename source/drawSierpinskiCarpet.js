export function drawSierpinskiCarpet(gl, n) {
	function subdivide(squares) {
		let newSquares = [];

		for (let i = 0; i < squares.length; i++) {
			const square = squares[i];
			const x = square.x;
			const y = square.y;
			const size = square.size;
			const step = size / 3;

			for (let row = 0; row < 3; row++) {
				for (let col = 0; col < 3; col++) {
					// Bỏ ô chính giữa để tạo "lỗ" Sierpinski Carpet.
					if (row === 1 && col === 1) {
						continue;
					}

					newSquares.push({
						x: x + col * step,
						y: y + row * step,
						size: step,
					});
				}
			}
		}

		return newSquares;
	}

	function pushEdge(vertices, p1, p2) {
		vertices.push(p1.x, p1.y, p2.x, p2.y);
	}

	function pushSquareEdges(vertices, square) {
		const x = square.x;
		const y = square.y;
		const size = square.size;

		const p1 = { x: x, y: y };
		const p2 = { x: x + size, y: y };
		const p3 = { x: x + size, y: y + size };
		const p4 = { x: x, y: y + size };

		pushEdge(vertices, p1, p2);
		pushEdge(vertices, p2, p3);
		pushEdge(vertices, p3, p4);
		pushEdge(vertices, p4, p1);
	}

	// Hình vuông gốc đặt cân giữa màn hình để dễ quan sát.
	let squares = [{ x: -0.8, y: -0.8, size: 1.6 }];

	for (let i = 0; i < n; i++) {
		squares = subdivide(squares);
	}

	const vertices = [];
	for (let i = 0; i < squares.length; i++) {
		pushSquareEdges(vertices, squares[i]);
	}

	const vertexData = new Float32Array(vertices);

	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

	const positionLocation = gl.getAttribLocation(gl.program, "a_position");
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	// Vẽ theo cặp điểm độc lập để thể hiện các cạnh của từng ô vuông.
	gl.drawArrays(gl.LINES, 0, vertices.length / 2);
}
