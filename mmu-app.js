/* ==========================================================================
   馬偕醫學大學 3D 互動校園島 — mmu-app.js (v2.0 擬真精細建築與完整雙語資料映射版)
   Mackay Medical University (MMU) Interactive 3D Campus Island Engine
   ========================================================================== */
(function () {
  'use strict';

  const THREE = window.THREE;
  const DATA = window.MMU_DATA;
  if (!THREE || !DATA) {
    console.error('MMU 3D Island: Missing THREE or MMU_DATA.');
    return;
  }

  /* ------------------------------------------------------------------------
     0. Bilingual & Data Normalization Helpers (徹底消除 [object Object] 與 undefined)
     ------------------------------------------------------------------------ */
  let currentLang = 'zh';

  function L(val, lang = currentLang) {
    if (val == null) return '';
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') {
      return val[lang] || val.zh || val.en || '';
    }
    return String(val);
  }

  function islCode(isl) {
    if (!isl) return '00';
    if (isl.code) return String(isl.code);
    return String(isl.number || 1).padStart(2, '0');
  }

  const PERSONA_ICONS = {
    all: '🗺️',
    prospect: '🎓',
    student: '📚',
    staff: '💼'
  };

  /* ------------------------------------------------------------------------
     1. Instanced Architectural Kit Engine (createKit)
     ------------------------------------------------------------------------ */
  const PAL = {
    cream: 0xf5efe6,
    milk: 0xffffff,
    brick: 0xb44638,
    brickDark: 0x873226,
    granite: 0xd8d3c8,
    graniteDark: 0xa6a196,
    slate: 0x36475c,
    navy: 0x162e4f,
    teal: 0x1d9a8c,
    tealLight: 0x56c7b9,
    coral: 0xe26856,
    gold: 0xf4b942,
    wood: 0x8b5a3c,
    woodLight: 0xc69468,
    foliage: 0x38884f,
    foliage2: 0x50a565,
    foliage3: 0x296a3c,
    glass: 0x7bc0f5,
    glassDark: 0x295682,
    steel: 0x9aa8b8,
    charcoal: 0x222933,
    redCross: 0xd9383a,
    sand: 0xe6d6b8,
    trackBlue: 0x2b6cb0
  };

  function createKit(topGroup) {
    const buckets = new Map();
    const matCache = new Map();
    const dummy = new THREE.Object3D();

    const geos = {
      box: new THREE.BoxGeometry(1, 1, 1),
      cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 16),
      cone: new THREE.ConeGeometry(0.5, 1, 16),
      sphere: new THREE.SphereGeometry(0.5, 16, 14),
      prism: new THREE.CylinderGeometry(0.5, 0.5, 1, 3),
      torus: new THREE.TorusGeometry(0.5, 0.12, 10, 24)
    };

    const windowMats = [];

    function getMat(color, opts = {}) {
      const key = `${color}_${opts.rough ?? 0.68}_${opts.metal ?? 0.08}_${opts.emissive ?? 0}_${opts.opacity ?? 1}_${opts.isWin ? 1 : 0}`;
      if (!matCache.has(key)) {
        const mat = new THREE.MeshStandardMaterial({
          color,
          roughness: opts.rough ?? 0.68,
          metalness: opts.metal ?? 0.08,
          emissive: opts.emissive ? new THREE.Color(opts.emissive) : new THREE.Color(0x000000),
          emissiveIntensity: opts.emissiveIntensity ?? 0,
          transparent: (opts.opacity ?? 1) < 1,
          opacity: opts.opacity ?? 1
        });
        if (opts.isWin) windowMats.push(mat);
        matCache.set(key, mat);
      }
      return matCache.get(key);
    }

    function pushInstance(geoName, color, matrix, opts = {}) {
      const mat = getMat(color, opts);
      const key = `${geoName}::${mat.uuid}`;
      if (!buckets.has(key)) {
        buckets.set(key, { geo: geos[geoName], mat, matrices: [] });
      }
      buckets.get(key).matrices.push(matrix.clone());
    }

    function composeMatrix(parent, pos, scale, rot) {
      dummy.position.set(pos[0], pos[1], pos[2]);
      if (rot) {
        dummy.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
      } else {
        dummy.rotation.set(0, 0, 0);
      }
      dummy.scale.set(scale[0], scale[1], scale[2]);
      dummy.updateMatrix();
      if (parent && parent !== topGroup) {
        parent.updateMatrixWorld(true);
        return new THREE.Matrix4().multiplyMatrices(parent.matrixWorld, dummy.matrix);
      }
      return dummy.matrix.clone();
    }

    const winOpt = { emissive: 0xffd480, emissiveIntensity: 0.22, rough: 0.18, metal: 0.35, isWin: true };

    const api = {
      PAL,
      winOpt,
      windowMats,
      addBox(parent, pos, scale, color, rot = null, opts = {}) {
        pushInstance('box', color, composeMatrix(parent, pos, scale, rot), opts);
      },
      addCyl(parent, pos, rTop, rBot, h, color, rot = null, opts = {}) {
        pushInstance('cyl', color, composeMatrix(parent, pos, [rTop * 2, h, rBot * 2], rot), opts);
      },
      addCone(parent, pos, r, h, color, rot = null, opts = {}) {
        pushInstance('cone', color, composeMatrix(parent, pos, [r * 2, h, r * 2], rot), opts);
      },
      addSphere(parent, pos, r, color, scale = [1, 1, 1], opts = {}) {
        pushInstance('sphere', color, composeMatrix(parent, pos, [r * 2 * scale[0], r * 2 * scale[1], r * 2 * scale[2]], null), opts);
      },
      addPrism(parent, pos, scale, color, rot = null, opts = {}) {
        pushInstance('prism', color, composeMatrix(parent, pos, scale, rot), opts);
      },
      addTorus(parent, pos, r, color, rot = null, opts = {}) {
        pushInstance('torus', color, composeMatrix(parent, pos, [r * 2, r * 2, r * 2], rot), opts);
      },
      // Multi-story architectural window grid (front & back facades + corner pilasters + entrance door)
      addWindowGrid(parent, cx, cy, cz, w, h, d, rows, cols, glassCol = PAL.glass) {
        const startX = cx - w * 0.36;
        const stepX = cols > 1 ? (w * 0.72) / (cols - 1) : 0;
        const startY = cy - h * 0.3;
        const stepY = rows > 1 ? (h * 0.64) / (rows - 1) : 0;
        const winW = Math.min(0.28, (w * 0.54) / Math.max(1, cols));
        const winH = Math.min(0.3, (h * 0.48) / Math.max(1, rows));

        // Corner vertical architectural pilasters
        const pilW = 0.09;
        api.addBox(parent, [cx - w * 0.48, cy, cz], [pilW, h * 0.98, d + 0.04], PAL.cream);
        api.addBox(parent, [cx + w * 0.48, cy, cz], [pilW, h * 0.98, d + 0.04], PAL.cream);

        for (let r = 0; r < rows; r++) {
          const wy = startY + r * stepY;
          // Horizontal floor spandrel ledge
          api.addBox(parent, [cx, wy - winH * 0.62, cz], [w * 0.96, 0.045, d + 0.05], PAL.granite);
          for (let c = 0; c < cols; c++) {
            const wx = cols === 1 ? cx : startX + c * stepX;
            api.addBox(parent, [wx, wy, cz], [winW, winH, d + 0.06], glassCol, null, winOpt);
          }
        }
        // Side facade windows
        api.addBox(parent, [cx, cy, cz], [w + 0.05, h * 0.55, d * 0.42], glassCol, null, winOpt);
        // Ground-floor entrance doorway & awning
        api.addBox(parent, [cx, cy - h * 0.36, cz + d * 0.5 + 0.03], [Math.min(0.55, w * 0.35), 0.38, 0.06], PAL.glassDark, null, winOpt);
        api.addBox(parent, [cx, cy - h * 0.15, cz + d * 0.5 + 0.14], [Math.min(0.75, w * 0.45), 0.06, 0.28], PAL.cream);
      },
      // Rooftop HVAC & architectural parapet details
      addRoofDetails(parent, cx, topY, cz, w, d, trimCol = PAL.graniteDark) {
        const t = 0.1;
        const ph = 0.14;
        api.addBox(parent, [cx, topY + ph * 0.5, cz + d * 0.5 - t * 0.5], [w, ph, t], trimCol);
        api.addBox(parent, [cx, topY + ph * 0.5, cz - d * 0.5 + t * 0.5], [w, ph, t], trimCol);
        api.addBox(parent, [cx - w * 0.5 + t * 0.5, topY + ph * 0.5, cz], [t, ph, d], trimCol);
        api.addBox(parent, [cx + w * 0.5 - t * 0.5, topY + ph * 0.5, cz], [t, ph, d], trimCol);
        // HVAC chiller units
        api.addBox(parent, [cx - w * 0.25, topY + 0.14, cz - d * 0.2], [0.38, 0.24, 0.28], PAL.steel);
        api.addBox(parent, [cx - w * 0.05, topY + 0.12, cz - d * 0.2], [0.28, 0.2, 0.24], PAL.steel);
      },
      // Detailed vehicle (Shuttle bus / Ambulance)
      addVehicle(parent, x, y, z, bodyCol, isAmbulance = false, rotY = 0) {
        const vg = new THREE.Group();
        vg.position.set(x, y, z);
        vg.rotation.y = rotY;
        parent.add(vg);
        // Chassis & cabin
        api.addBox(vg, [0, 0.28, 0], [1.05, 0.42, 0.48], bodyCol);
        api.addBox(vg, [0, 0.34, 0], [0.88, 0.22, 0.5], PAL.glass, null, winOpt);
        api.addBox(vg, [0.46, 0.32, 0], [0.16, 0.22, 0.44], PAL.glass, null, winOpt);
        // 4 Wheels
        [[-0.32, 0.24], [0.32, 0.24], [-0.32, -0.24], [0.32, -0.24]].forEach(([wx, wz]) => {
          api.addCyl(vg, [wx, 0.11, wz], 0.11, 0.11, 0.08, PAL.charcoal, [Math.PI / 2, 0, 0]);
        });
        if (isAmbulance) {
          api.addBox(vg, [0.15, 0.53, 0], [0.22, 0.08, 0.28], PAL.redCross);
          api.addBox(vg, [-0.15, 0.28, 0.25], [0.24, 0.07, 0.02], PAL.redCross);
          api.addBox(vg, [-0.15, 0.28, 0.25], [0.07, 0.24, 0.02], PAL.redCross);
        } else {
          api.addBox(vg, [-0.1, 0.52, 0], [0.45, 0.07, 0.32], PAL.milk);
        }
      },
      addTree(parent, x, y, z, scale = 1, variant = 0) {
        const s = scale;
        api.addCyl(parent, [x, y + 0.38 * s, z], 0.09 * s, 0.14 * s, 0.76 * s, PAL.wood);
        const col = variant % 3 === 0 ? PAL.foliage : variant % 3 === 1 ? PAL.foliage2 : PAL.foliage3;
        if (variant % 2 === 0) {
          api.addSphere(parent, [x, y + 0.96 * s, z], 0.48 * s, col, [1, 1.12, 1]);
          api.addSphere(parent, [x + 0.2 * s, y + 0.82 * s, z + 0.14 * s], 0.34 * s, PAL.foliage2);
          api.addSphere(parent, [x - 0.18 * s, y + 0.84 * s, z - 0.12 * s], 0.3 * s, PAL.foliage3);
        } else {
          api.addCone(parent, [x, y + 0.85 * s, z], 0.5 * s, 0.95 * s, col);
          api.addCone(parent, [x, y + 1.28 * s, z], 0.38 * s, 0.78 * s, PAL.foliage2);
          api.addCone(parent, [x, y + 1.62 * s, z], 0.25 * s, 0.55 * s, PAL.foliage);
        }
      },
      addLamp(parent, x, y, z) {
        api.addCyl(parent, [x, y + 0.68, z], 0.035, 0.055, 1.35, PAL.charcoal);
        api.addSphere(parent, [x, y + 1.4, z], 0.11, 0xffe699, [1, 1, 1], winOpt);
      },
      addBench(parent, x, y, z, rotY = 0) {
        const bg = new THREE.Group();
        bg.position.set(x, y, z);
        bg.rotation.y = rotY;
        parent.add(bg);
        api.addBox(bg, [-0.32, 0.1, 0], [0.07, 0.2, 0.3], PAL.charcoal);
        api.addBox(bg, [0.32, 0.1, 0], [0.07, 0.2, 0.3], PAL.charcoal);
        api.addBox(bg, [0, 0.2, 0.02], [0.86, 0.06, 0.32], PAL.woodLight);
        api.addBox(bg, [0, 0.36, -0.12], [0.86, 0.24, 0.06], PAL.wood, [-0.15, 0, 0]);
        api.addBox(bg, [-0.39, 0.28, 0], [0.06, 0.12, 0.3], PAL.wood);
        api.addBox(bg, [0.39, 0.28, 0], [0.06, 0.12, 0.3], PAL.wood);
      },
      // 1) 三芝特產「茭白筍（美人腿）」單株擬真模型
      addSingleWaterBamboo(parent, x, y, z, scale = 1, rotY = 0, tiltZ = 0) {
        const s = scale;
        const g = new THREE.Group();
        g.position.set(x, y, z);
        g.rotation.set(0, rotY, tiltZ);
        parent.add(g);

        // 飽滿潔白的「美人腿」筍肉本體 (下半部圓潤飽滿、上半部修長微彎收尖)
        api.addSphere(g, [0, 0.32 * s, 0], 0.22 * s, 0xfdfbf5, [0.95, 1.85, 0.9], { rough: 0.25 });
        api.addCyl(g, [0.02 * s, 0.68 * s, 0], 0.07 * s, 0.17 * s, 0.56 * s, 0xfaf6eb, [0, 0, -0.08], { rough: 0.25 });
        // 筍尖嫩綠芽頭
        api.addCone(g, [0.05 * s, 1.04 * s, 0], 0.07 * s, 0.26 * s, 0xb8e3a8, [0, 0, -0.14]);

        // 半剝開包覆基部的翠綠筍殼 (3 片微張筍鞘，襯托內部白皙筍肉)
        api.addCone(g, [-0.14 * s, 0.48 * s, 0.04 * s], 0.15 * s, 0.85 * s, PAL.foliage2, [0.08, 0, 0.28]);
        api.addCone(g, [0.14 * s, 0.45 * s, -0.04 * s], 0.14 * s, 0.78 * s, PAL.foliage, [-0.06, 0, -0.32]);
        api.addCone(g, [0, 0.52 * s, -0.14 * s], 0.16 * s, 0.92 * s, PAL.foliage3, [-0.26, 0, 0]);

        // 向上舒展的修長翠綠茭白筍葉片
        api.addBox(g, [-0.22 * s, 1.05 * s, 0], [0.05 * s, 0.85 * s, 0.12 * s], PAL.foliage2, [0, 0.2, 0.32]);
        api.addBox(g, [0.18 * s, 1.12 * s, -0.06 * s], [0.05 * s, 0.92 * s, 0.11 * s], PAL.foliage, [-0.15, 0, -0.25]);
      },
      // 2) 三芝「茭白筍（美人腿）」主題景觀藝術雕塑座 (含水池花台與夜間暖光)
      addWaterBambooSculpture(parent, x, y, z, scale = 1.0) {
        const s = scale;
        const sg = new THREE.Group();
        sg.position.set(x, y, z);
        parent.add(sg);

        // 圓形花崗岩與赤陶水池基座
        api.addCyl(sg, [0, 0.12 * s, 0], 0.95 * s, 1.05 * s, 0.24 * s, PAL.granite);
        api.addCyl(sg, [0, 0.25 * s, 0], 0.82 * s, 0.86 * s, 0.08 * s, PAL.brick);
        api.addCyl(sg, [0, 0.28 * s, 0], 0.74 * s, 0.74 * s, 0.05 * s, PAL.tealLight, null, winOpt);

        // 三株高低錯落的三芝茭白筍「美人腿」雕塑
        api.addSingleWaterBamboo(sg, 0, 0.26 * s, 0, 1.18 * s, 0.2, 0.05);
        api.addSingleWaterBamboo(sg, -0.32 * s, 0.24 * s, 0.18 * s, 0.88 * s, 1.4, 0.18);
        api.addSingleWaterBamboo(sg, 0.3 * s, 0.24 * s, 0.14 * s, 0.82 * s, -1.1, -0.16);
      },
      // 3) 三芝水梯田茭白筍生態造景畦
      addWaterBambooPatch(parent, x, y, z, rotY = 0) {
        const pg = new THREE.Group();
        pg.position.set(x, y, z);
        pg.rotation.y = rotY;
        parent.add(pg);

        // 梯田石砌水畦與淺水層
        api.addBox(pg, [0, 0.08, 0], [1.9, 0.16, 0.95], PAL.graniteDark);
        api.addBox(pg, [0, 0.14, 0], [1.72, 0.08, 0.78], 0x3b82f6, null, { rough: 0.15, metal: 0.2 });
        // 4 叢水田中生長的茭白筍
        [-0.56, -0.18, 0.2, 0.58].forEach((bx, i) => {
          const bz = (i % 2 === 0 ? -0.12 : 0.12);
          api.addSingleWaterBamboo(pg, bx, 0.14, bz, 0.62, i * 0.9, (i % 2 === 0 ? 0.08 : -0.08));
        });
      },
      // 4) 戶外休閒座椅家具：露天遮陽傘咖啡圓桌四椅組
      addCafeParasolSet(parent, x, y, z, umbrellaCol = PAL.coral) {
        const cg = new THREE.Group();
        cg.position.set(x, y, z);
        parent.add(cg);

        // 圓桌
        api.addCyl(cg, [0, 0.22, 0], 0.05, 0.16, 0.44, PAL.charcoal);
        api.addCyl(cg, [0, 0.45, 0], 0.44, 0.44, 0.06, PAL.cream);
        // 4 張靠背休閒椅
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2 + 0.35;
          const cx = Math.cos(a) * 0.64;
          const cz = Math.sin(a) * 0.64;
          api.addCyl(cg, [cx, 0.14, cz], 0.04, 0.12, 0.28, PAL.charcoal);
          api.addBox(cg, [cx, 0.28, cz], [0.28, 0.05, 0.28], PAL.woodLight, [0, -a, 0]);
          api.addBox(cg, [cx + Math.cos(a) * 0.12, 0.42, cz + Math.sin(a) * 0.12], [0.05, 0.26, 0.28], PAL.wood, [0, -a, 0]);
        }
        // 遮陽傘柱與八角傘面
        api.addCyl(cg, [0, 0.92, 0], 0.035, 0.04, 1.35, PAL.steel);
        api.addCone(cg, [0, 1.62, 0], 0.88, 0.38, umbrellaCol);
        api.addSphere(cg, [0, 1.84, 0], 0.07, PAL.milk);
      },
      // 5) 戶外休閒家具：木構藤架涼亭與 L 型軟墊沙發休憩區
      addPergolaLounge(parent, x, y, z, rotY = 0) {
        const lg = new THREE.Group();
        lg.position.set(x, y, z);
        lg.rotation.y = rotY;
        parent.add(lg);

        // 木平台基座
        api.addBox(lg, [0, 0.05, 0], [2.1, 0.1, 1.55], PAL.woodLight);
        // 4 根木立柱與頂部格柵藤架
        [[-0.92, -0.65], [0.92, -0.65], [-0.92, 0.65], [0.92, 0.65]].forEach(([px, pz]) => {
          api.addBox(lg, [px, 0.78, pz], [0.1, 1.45, 0.1], PAL.wood);
        });
        api.addBox(lg, [0, 1.52, -0.65], [2.05, 0.1, 0.1], PAL.wood);
        api.addBox(lg, [0, 1.52, 0.65], [2.05, 0.1, 0.1], PAL.wood);
        for (let sx = -0.85; sx <= 0.86; sx += 0.34) {
          api.addBox(lg, [sx, 1.58, 0], [0.07, 0.06, 1.5], PAL.woodLight);
        }
        // 頂部攀藤綠植點綴
        api.addBox(lg, [-0.35, 1.63, 0.1], [0.75, 0.08, 0.65], PAL.foliage2);
        // L 型戶外休閒沙發與茶几
        api.addBox(lg, [0, 0.22, -0.38], [1.45, 0.22, 0.45], PAL.wood);
        api.addBox(lg, [0, 0.35, -0.36], [1.38, 0.08, 0.4], PAL.cream);
        api.addBox(lg, [0, 0.5, -0.54], [1.38, 0.26, 0.1], PAL.tealLight);
        api.addBox(lg, [-0.52, 0.22, 0.12], [0.45, 0.22, 0.62], PAL.wood);
        api.addBox(lg, [-0.52, 0.35, 0.12], [0.4, 0.08, 0.58], PAL.cream);
        // 戶外木茶几
        api.addBox(lg, [0.2, 0.24, 0.18], [0.68, 0.18, 0.44], PAL.woodLight);
      },
      // 6) 戶外休閒家具：草地野餐共學木桌椅組
      addPicnicTable(parent, x, y, z, rotY = 0) {
        const tg = new THREE.Group();
        tg.position.set(x, y, z);
        tg.rotation.y = rotY;
        parent.add(tg);

        api.addBox(tg, [0, 0.38, 0], [1.15, 0.07, 0.52], PAL.woodLight);
        api.addBox(tg, [-0.38, 0.2, 0], [0.08, 0.36, 0.85], PAL.wood);
        api.addBox(tg, [0.38, 0.2, 0], [0.08, 0.36, 0.85], PAL.wood);
        api.addBox(tg, [0, 0.22, 0.42], [1.15, 0.06, 0.24], PAL.woodLight);
        api.addBox(tg, [0, 0.22, -0.42], [1.15, 0.06, 0.24], PAL.woodLight);
      },
      flush() {
        const instGroup = new THREE.Group();
        instGroup.name = 'InstancedKitMeshes';
        buckets.forEach(({ geo, mat, matrices }) => {
          if (!matrices.length) return;
          const im = new THREE.InstancedMesh(geo, mat, matrices.length);
          im.castShadow = true;
          im.receiveShadow = true;
          for (let i = 0; i < matrices.length; i++) {
            im.setMatrixAt(i, matrices[i]);
          }
          im.instanceMatrix.needsUpdate = true;
          instGroup.add(im);
        });
        topGroup.add(instGroup);
      }
    };
    return api;
  }

  /* ------------------------------------------------------------------------
     2. Procedural Ground Textures
     ------------------------------------------------------------------------ */
  function makeGroundTexture(type, tintHex) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');
    const base = new THREE.Color(tintHex);
    // Soften island surface color so buildings pop with high contrast
    base.lerp(new THREE.Color(0xe2e8f0), 0.35);
    ctx.fillStyle = `#${base.getHexString()}`;
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 2;
    if (type === 'granite' || type === 'street') {
      for (let i = 0; i < 256; i += 32) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
      }
    } else if (type === 'garden' || type === 'schoolyard') {
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      for (let i = 0; i < 64; i++) {
        ctx.beginPath();
        ctx.arc((i * 73) % 256, (i * 137) % 256, 3 + (i % 4), 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      for (let y = 0; y < 256; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }

  /* ------------------------------------------------------------------------
     3. High-Detail Procedural Miniature Landmarks (27 Buildings)
     ------------------------------------------------------------------------ */
  function buildBuildingModel(kit, parent, b) {
    const kind = b.kind;
    const s = (b.pos[2] || 0.9) * 1.12;
    const W = kit.winOpt;

    // Stepped architectural base podium + entrance plaza
    kit.addBox(parent, [0, 0.08, 0], [3.6 * s, 0.16, 3.1 * s], PAL.graniteDark);
    kit.addBox(parent, [0, 0.2, 0], [3.3 * s, 0.14, 2.8 * s], PAL.granite);
    // Front entrance steps
    kit.addBox(parent, [0, 0.12, 1.48 * s], [1.1 * s, 0.12, 0.32 * s], PAL.cream);

    switch (kind) {
      case 'medhall': {
        // 醫學系暨大體解剖教學大樓：4 層紅磚花崗岩主樓 + 左右對稱側翼 + 古典柱廊 + 大體教學中心玻璃採光穹頂
        kit.addBox(parent, [0, 1.35 * s, -0.1 * s], [2.4 * s, 2.2 * s, 1.65 * s], PAL.brick);
        kit.addBox(parent, [-1.15 * s, 1.1 * s, 0.1 * s], [0.75 * s, 1.7 * s, 1.5 * s], PAL.brickDark);
        kit.addBox(parent, [1.15 * s, 1.1 * s, 0.1 * s], [0.75 * s, 1.7 * s, 1.5 * s], PAL.brickDark);
        kit.addWindowGrid(parent, 0, 1.38 * s, -0.1 * s, 2.2 * s, 1.9 * s, 1.65 * s, 4, 5);
        kit.addRoofDetails(parent, 0, 2.45 * s, -0.1 * s, 2.45 * s, 1.7 * s, PAL.cream);
        // Classical entrance portico & 4 columns
        kit.addBox(parent, [0, 1.55 * s, 0.92 * s], [1.45 * s, 0.18 * s, 0.55 * s], PAL.cream);
        for (let x = -0.54; x <= 0.55; x += 0.36) {
          kit.addCyl(parent, [x * s, 0.88 * s, 1.1 * s], 0.065 * s, 0.075 * s, 1.25 * s, PAL.cream);
        }
        // Central glass skylight dome for Silent Mentor (大體老師) center
        kit.addSphere(parent, [0, 2.55 * s, -0.1 * s], 0.58 * s, PAL.glass, [1.25, 0.75, 1], W);
        // Medical Cross on top
        kit.addBox(parent, [0, 3.12 * s, -0.1 * s], [0.34 * s, 0.1 * s, 0.08 * s], PAL.redCross);
        kit.addBox(parent, [0, 3.12 * s, -0.1 * s], [0.1 * s, 0.34 * s, 0.08 * s], PAL.redCross);
        break;
      }
      case 'labtower': {
        // 醫檢暨再生醫學大樓：5 層現代實驗塔樓 + 玻璃帷幕 + 排氣煙囪 + 3D 雙螺旋 DNA 雕塑
        kit.addBox(parent, [-0.35 * s, 1.65 * s, -0.1 * s], [1.75 * s, 2.8 * s, 1.55 * s], PAL.cream);
        kit.addWindowGrid(parent, -0.35 * s, 1.68 * s, -0.1 * s, 1.6 * s, 2.45 * s, 1.55 * s, 5, 4);
        kit.addRoofDetails(parent, -0.35 * s, 3.05 * s, -0.1 * s, 1.8 * s, 1.6 * s, PAL.steel);
        // Twin stainless exhaust stacks
        kit.addCyl(parent, [-0.75 * s, 3.45 * s, -0.45 * s], 0.1 * s, 0.1 * s, 0.8 * s, PAL.steel);
        kit.addCyl(parent, [-0.45 * s, 3.45 * s, -0.45 * s], 0.1 * s, 0.1 * s, 0.8 * s, PAL.steel);
        // 3D DNA Double Helix Sculpture on pedestal
        kit.addCyl(parent, [0.95 * s, 0.42 * s, 0.35 * s], 0.38 * s, 0.44 * s, 0.32 * s, PAL.navy);
        for (let i = 0; i < 8; i++) {
          const ang = i * 0.65;
          const dy = (0.68 + i * 0.24) * s;
          const dx = Math.cos(ang) * 0.22 * s;
          const dz = Math.sin(ang) * 0.22 * s;
          kit.addSphere(parent, [0.95 * s + dx, dy, 0.35 * s + dz], 0.085 * s, PAL.teal);
          kit.addSphere(parent, [0.95 * s - dx, dy, 0.35 * s - dz], 0.085 * s, PAL.coral);
          kit.addBox(parent, [0.95 * s, dy, 0.35 * s], [0.42 * s, 0.03 * s, 0.03 * s], PAL.gold, [0, -ang, 0]);
        }
        break;
      }
      case 'optdome': {
        // 視光學系：弧形現代視覺中心 + 巨型精密驗光透鏡環 + 視力表地標
        kit.addCyl(parent, [-0.15 * s, 1.15 * s, -0.1 * s], 1.18 * s, 1.22 * s, 1.8 * s, PAL.milk);
        kit.addCyl(parent, [-0.15 * s, 1.25 * s, -0.1 * s], 1.21 * s, 1.21 * s, 0.55 * s, PAL.glass, null, W);
        kit.addSphere(parent, [-0.15 * s, 2.05 * s, -0.1 * s], 1.08 * s, PAL.glass, [1, 0.6, 1], W);
        // Coaxial Optical Lens Rings
        kit.addTorus(parent, [-0.15 * s, 1.45 * s, 1.15 * s], 0.46 * s, PAL.teal);
        kit.addTorus(parent, [-0.15 * s, 1.45 * s, 1.2 * s], 0.3 * s, PAL.gold);
        kit.addSphere(parent, [-0.15 * s, 1.45 * s, 1.18 * s], 0.18 * s, PAL.navy);
        // Eye chart monolith
        kit.addBox(parent, [1.05 * s, 0.95 * s, 0.65 * s], [0.42 * s, 1.35 * s, 0.12 * s], PAL.milk);
        kit.addBox(parent, [1.05 * s, 1.35 * s, 0.72 * s], [0.22 * s, 0.22 * s, 0.04 * s], PAL.navy);
        break;
      }
      case 'biomedpod': {
        // 生物醫學研究所：雙子星生醫研究塔 + 空中無塵室玻璃連通橋
        kit.addBox(parent, [-0.75 * s, 1.35 * s, -0.1 * s], [1.15 * s, 2.2 * s, 1.35 * s], PAL.milk);
        kit.addBox(parent, [0.75 * s, 1.55 * s, -0.1 * s], [1.15 * s, 2.6 * s, 1.35 * s], PAL.milk);
        kit.addWindowGrid(parent, -0.75 * s, 1.35 * s, -0.1 * s, 1.05 * s, 1.9 * s, 1.35 * s, 4, 2);
        kit.addWindowGrid(parent, 0.75 * s, 1.55 * s, -0.1 * s, 1.05 * s, 2.3 * s, 1.35 * s, 5, 2);
        // Elevated Glass Skybridge
        kit.addBox(parent, [0, 1.65 * s, -0.05 * s], [1.4 * s, 0.44 * s, 0.65 * s], PAL.tealLight, null, W);
        kit.addSphere(parent, [-0.75 * s, 2.55 * s, -0.1 * s], 0.48 * s, PAL.teal);
        kit.addSphere(parent, [0.75 * s, 2.95 * s, -0.1 * s], 0.48 * s, PAL.teal);
        break;
      }
      case 'nursinghall': {
        // 護理學系大樓：4 層溫暖珊瑚紅與米白教學樓 + 南丁格爾金燈紀念碑
        kit.addBox(parent, [0, 1.35 * s, -0.15 * s], [2.45 * s, 2.2 * s, 1.55 * s], PAL.cream);
        kit.addBox(parent, [0, 2.52 * s, -0.15 * s], [2.6 * s, 0.22 * s, 1.7 * s], PAL.coral);
        kit.addWindowGrid(parent, 0, 1.35 * s, -0.15 * s, 2.25 * s, 1.9 * s, 1.55 * s, 4, 5);
        // Nightingale Golden Lamp Monument in front plaza
        kit.addCyl(parent, [0, 0.52 * s, 1.02 * s], 0.28 * s, 0.36 * s, 0.55 * s, PAL.granite);
        kit.addSphere(parent, [0, 0.92 * s, 1.02 * s], 0.28 * s, PAL.gold, [1.45, 0.75, 1]);
        kit.addCone(parent, [0, 1.24 * s, 1.02 * s], 0.14 * s, 0.34 * s, 0xffae00, null, W);
        break;
      }
      case 'simward': {
        // 高擬真臨床技能模擬中心 (OSCE)：臨床病房大樓 + 急診車道雨遮 + 擬真救護車
        kit.addBox(parent, [-0.15 * s, 1.25 * s, -0.2 * s], [2.3 * s, 2.0 * s, 1.5 * s], PAL.milk);
        kit.addWindowGrid(parent, -0.15 * s, 1.28 * s, -0.2 * s, 2.1 * s, 1.7 * s, 1.5 * s, 3, 4);
        kit.addRoofDetails(parent, -0.15 * s, 2.25 * s, -0.2 * s, 2.35 * s, 1.55 * s, PAL.teal);
        // Red Cross badge
        kit.addBox(parent, [-0.9 * s, 1.85 * s, 0.58 * s], [0.42 * s, 0.13 * s, 0.06 * s], PAL.redCross);
        kit.addBox(parent, [-0.9 * s, 1.85 * s, 0.58 * s], [0.13 * s, 0.42 * s, 0.06 * s], PAL.redCross);
        // Ambulance bay canopy & Ambulance
        kit.addBox(parent, [0.55 * s, 0.95 * s, 0.85 * s], [1.35 * s, 0.12 * s, 0.85 * s], PAL.teal);
        kit.addVehicle(parent, 0.55 * s, 0.26, 0.92 * s, PAL.milk, true, 0.15);
        break;
      }
      case 'carepavilion': {
        // 社區健康與偏鄉護理站：溫潤木構斜頂照護館 + 無障礙坡道 + 戶外衛教篩檢亭
        kit.addBox(parent, [-0.2 * s, 0.95 * s, -0.1 * s], [2.1 * s, 1.45 * s, 1.5 * s], PAL.cream);
        kit.addWindowGrid(parent, -0.2 * s, 0.95 * s, -0.1 * s, 1.9 * s, 1.2 * s, 1.5 * s, 2, 4);
        kit.addCone(parent, [-0.2 * s, 2.12 * s, -0.1 * s], 1.65 * s, 0.95 * s, PAL.wood, [0, Math.PI / 4, 0]);
        // Barrier-free ramp
        kit.addBox(parent, [-0.2 * s, 0.34 * s, 0.95 * s], [1.5 * s, 0.12 * s, 0.42 * s], PAL.woodLight, [0.12, 0, 0]);
        // Outdoor community health gazebo
        kit.addCone(parent, [1.05 * s, 1.15 * s, 0.65 * s], 0.55 * s, 0.45 * s, PAL.teal, [0, Math.PI / 4, 0]);
        kit.addCyl(parent, [1.05 * s, 0.58 * s, 0.65 * s], 0.05 * s, 0.05 * s, 0.7 * s, PAL.milk);
        break;
      }
      case 'audhall': {
        // 聽力暨語言治療學系：聲學波浪鰭片屋頂大樓 + 標準無響室方艙
        kit.addBox(parent, [-0.15 * s, 1.18 * s, -0.1 * s], [2.3 * s, 1.85 * s, 1.55 * s], PAL.milk);
        kit.addWindowGrid(parent, -0.15 * s, 1.15 * s, -0.1 * s, 2.1 * s, 1.5 * s, 1.55 * s, 3, 4);
        // 9 Acoustic wave roof fins
        for (let i = -4; i <= 4; i++) {
          const fh = 0.28 + Math.cos(i * 0.55) * 0.24;
          kit.addBox(parent, [(-0.15 + i * 0.24) * s, (2.12 + fh * 0.5) * s, -0.1 * s], [0.1 * s, fh * s, 1.65 * s], PAL.teal);
        }
        // Soundwave ring sculpture
        kit.addTorus(parent, [0.95 * s, 0.85 * s, 0.85 * s], 0.36 * s, PAL.gold);
        kit.addTorus(parent, [0.95 * s, 0.85 * s, 0.85 * s], 0.22 * s, PAL.tealLight);
        break;
      }
      case 'ltcgarden': {
        // 長期照護研究所：L 型療癒長照大樓 + 玻璃溫室花園 + 環狀步道
        kit.addBox(parent, [-0.55 * s, 1.15 * s, -0.25 * s], [1.65 * s, 1.8 * s, 1.3 * s], PAL.cream);
        kit.addWindowGrid(parent, -0.55 * s, 1.15 * s, -0.25 * s, 1.45 * s, 1.5 * s, 1.3 * s, 3, 3);
        // Glass greenhouse conservatory
        kit.addBox(parent, [0.65 * s, 0.85 * s, -0.2 * s], [1.1 * s, 1.2 * s, 1.2 * s], PAL.glass, null, { opacity: 0.78, isWin: true, emissive: 0x86efac, emissiveIntensity: 0.25 });
        // Healing garden trees & circular path
        kit.addTorus(parent, [0.45 * s, 0.29, 0.72 * s], 0.52 * s, PAL.sand, [Math.PI / 2, 0, 0]);
        kit.addTree(parent, 0.45 * s, 0.26, 0.72 * s, 0.85 * s, 0);
        kit.addTree(parent, -0.85 * s, 0.26, 0.82 * s, 0.75 * s, 1);
        break;
      }
      case 'geropod': {
        // 高齡福祉科技研究所：智慧科技圓頂館 + 戶外「樂齡地壺球 (Floor Curling)」賽道
        kit.addCyl(parent, [-0.35 * s, 1.05 * s, -0.15 * s], 1.05 * s, 1.1 * s, 1.6 * s, PAL.cream);
        kit.addSphere(parent, [-0.35 * s, 1.85 * s, -0.15 * s], 1.02 * s, PAL.teal, [1, 0.65, 1]);
        kit.addWindowGrid(parent, -0.35 * s, 1.05 * s, -0.15 * s, 1.4 * s, 1.2 * s, 2.15 * s, 2, 3);
        // Outdoor Floor Curling (地壺球) lane & target rings
        kit.addBox(parent, [0.95 * s, 0.28, 0.1 * s], [0.68 * s, 0.04, 2.1 * s], PAL.trackBlue);
        kit.addCyl(parent, [0.95 * s, 0.31, -0.55 * s], 0.26 * s, 0.26 * s, 0.03, PAL.redCross);
        kit.addCyl(parent, [0.95 * s, 0.32, -0.55 * s], 0.14 * s, 0.14 * s, 0.03, PAL.milk);
        break;
      }
      case 'sensorylab': {
        // 老化感官體驗實驗室：博覽會展館造型 + 視覺/聽覺/平衡三色感官體驗艙
        kit.addBox(parent, [0, 1.1 * s, -0.2 * s], [2.3 * s, 1.7 * s, 1.4 * s], PAL.slate);
        kit.addWindowGrid(parent, 0, 1.1 * s, -0.2 * s, 2.0 * s, 1.4 * s, 1.4 * s, 2, 4);
        // 3 Colorful Sensory Experience Pods in front
        kit.addCyl(parent, [-0.7 * s, 0.68 * s, 0.82 * s], 0.34 * s, 0.34 * s, 0.85 * s, PAL.coral);
        kit.addCyl(parent, [0, 0.68 * s, 0.82 * s], 0.34 * s, 0.34 * s, 0.85 * s, PAL.gold);
        kit.addCyl(parent, [0.7 * s, 0.68 * s, 0.82 * s], 0.34 * s, 0.34 * s, 0.85 * s, PAL.tealLight);
        break;
      }
      case 'chapel': {
        // 馬偕精神禮拜堂（焚而不燬）：哥德式紅磚禮拜堂 + 扶壁 + 玫瑰花窗 + 高聳鐘樓十字架 + 焚而不燬火炬
        kit.addBox(parent, [0, 1.25 * s, -0.1 * s], [1.85 * s, 1.95 * s, 2.35 * s], PAL.brick);
        // 6 Gothic side buttresses
        for (let z = -0.85; z <= 0.85; z += 0.85) {
          kit.addBox(parent, [-1.0 * s, 1.0 * s, z * s], [0.22 * s, 1.5 * s, 0.24 * s], PAL.brickDark);
          kit.addBox(parent, [1.0 * s, 1.0 * s, z * s], [0.22 * s, 1.5 * s, 0.24 * s], PAL.brickDark);
        }
        // Steep pitched roof
        kit.addPrism(parent, [0, 2.65 * s, -0.1 * s], [2.1 * s, 2.45 * s, 1.15 * s], PAL.slate, [Math.PI / 2, 0, 0]);
        // Bell tower & spire
        kit.addBox(parent, [0, 2.45 * s, 0.82 * s], [0.72 * s, 1.6 * s, 0.72 * s], PAL.brick);
        kit.addCone(parent, [0, 3.65 * s, 0.82 * s], 0.52 * s, 1.1 * s, PAL.slate, [0, Math.PI / 4, 0]);
        // Glowing Golden Cross
        kit.addBox(parent, [0, 4.45 * s, 0.82 * s], [0.1 * s, 0.68 * s, 0.1 * s], PAL.gold, null, W);
        kit.addBox(parent, [0, 4.55 * s, 0.82 * s], [0.42 * s, 0.1 * s, 0.1 * s], PAL.gold, null, W);
        // Rose stained-glass window
        kit.addSphere(parent, [0, 1.65 * s, 1.19 * s], 0.36 * s, PAL.gold, [1, 1, 0.2], W);
        break;
      }
      case 'rotunda': {
        // 全人教育中心：古典柱列圓頂廳 + 階梯式戶外圓形劇場
        kit.addCyl(parent, [0, 1.15 * s, -0.15 * s], 1.25 * s, 1.3 * s, 1.75 * s, PAL.cream);
        for (let i = 0; i < 10; i++) {
          const a = (i * Math.PI * 2) / 10;
          kit.addCyl(parent, [Math.cos(a) * 1.32 * s, 1.05 * s, -0.15 * s + Math.sin(a) * 1.32 * s], 0.07 * s, 0.08 * s, 1.55 * s, PAL.milk);
        }
        kit.addSphere(parent, [0, 2.05 * s, -0.15 * s], 1.18 * s, PAL.teal, [1, 0.62, 1]);
        kit.addSphere(parent, [0, 2.65 * s, -0.15 * s], 0.28 * s, PAL.gold, [1, 1, 1], W);
        break;
      }
      case 'museum': {
        // 數位校史館暨馬偕故事館（淡水牛津學堂中西合璧紅磚古蹟意象）
        kit.addBox(parent, [0, 1.05 * s, 0], [2.5 * s, 1.6 * s, 1.7 * s], PAL.brick);
        kit.addWindowGrid(parent, 0, 1.05 * s, 0, 2.2 * s, 1.2 * s, 1.7 * s, 2, 5);
        // Traditional curved roof ridge + 4 Oxford College western corner turrets
        kit.addPrism(parent, [0, 2.15 * s, 0], [2.7 * s, 1.9 * s, 0.75 * s], PAL.brickDark, [0, 0, Math.PI / 2]);
        [[-1.1, 0.75], [1.1, 0.75], [-1.1, -0.75], [1.1, -0.75]].forEach(([tx, tz]) => {
          kit.addCone(parent, [tx * s, 2.25 * s, tz * s], 0.24 * s, 0.65 * s, PAL.gold);
        });
        break;
      }
      case 'monument': {
        // 治校理念與馬偕精神紀念碑（焚而不燬永恆之火）
        kit.addCyl(parent, [0, 0.42 * s, 0], 1.15 * s, 1.3 * s, 0.35 * s, PAL.granite);
        kit.addCyl(parent, [0, 0.72 * s, 0], 0.78 * s, 0.92 * s, 0.35 * s, PAL.cream);
        kit.addBox(parent, [0, 1.75 * s, 0], [0.48 * s, 1.8 * s, 0.48 * s], PAL.navy);
        kit.addSphere(parent, [0, 2.85 * s, 0], 0.52 * s, PAL.coral, [1.1, 1.35, 1.1], W);
        kit.addSphere(parent, [0, 3.05 * s, 0], 0.32 * s, PAL.gold, [1, 1.45, 1], W);
        break;
      }
      case 'familydorm': {
        // 家庭式優質學生宿舍：雙塔 6 層溫馨公寓大樓 + 獨立陽台 + 中央交誼廳連通廊
        [-0.82, 0.82].forEach((dx) => {
          kit.addBox(parent, [dx * s, 1.65 * s, -0.1 * s], [1.18 * s, 2.8 * s, 1.5 * s], PAL.cream);
          kit.addWindowGrid(parent, dx * s, 1.65 * s, -0.1 * s, 1.05 * s, 2.4 * s, 1.5 * s, 5, 3);
          // Pitched warm tile roof cap
          kit.addCone(parent, [dx * s, 3.35 * s, -0.1 * s], 0.92 * s, 0.65 * s, PAL.brick, [0, Math.PI / 4, 0]);
        });
        // Central shared living room & lounge skybridge
        kit.addBox(parent, [0, 1.05 * s, 0.1 * s], [0.75 * s, 1.5 * s, 1.2 * s], PAL.glass, null, W);
        kit.addTree(parent, 0, 0.26, 1.05 * s, 0.85 * s, 2);
        break;
      }
      case 'library': {
        // 圖書館暨馬偕共學園：4 層山海景觀玻璃帷幕大樓 + 懸挑海景閱覽露台
        kit.addBox(parent, [0, 1.35 * s, -0.1 * s], [2.5 * s, 2.2 * s, 1.75 * s], PAL.navy);
        kit.addWindowGrid(parent, 0, 1.35 * s, -0.1 * s, 2.35 * s, 1.9 * s, 1.75 * s, 4, 6);
        // Cantilevered sea-view reading terrace
        kit.addBox(parent, [0, 1.25 * s, 0.95 * s], [2.2 * s, 0.18 * s, 0.55 * s], PAL.cream);
        kit.addBox(parent, [0, 2.52 * s, 0], [2.7 * s, 0.2 * s, 2.05 * s], PAL.cream);
        break;
      }
      case 'arena': {
        // 多功能活動中心與運動場：大跨度弧頂體育館 + 戶外藍色PU跑道球場
        kit.addBox(parent, [-0.45 * s, 1.05 * s, -0.15 * s], [1.85 * s, 1.55 * s, 1.65 * s], PAL.milk);
        kit.addCyl(parent, [-0.45 * s, 1.82 * s, -0.15 * s], 0.82 * s, 0.82 * s, 1.88 * s, PAL.teal, [0, 0, Math.PI / 2]);
        kit.addWindowGrid(parent, -0.45 * s, 1.0 * s, -0.15 * s, 1.65 * s, 1.2 * s, 1.65 * s, 2, 4);
        // Outdoor athletic track & court
        kit.addBox(parent, [0.95 * s, 0.28, 0], [1.05 * s, 0.05, 2.1 * s], PAL.coral);
        kit.addBox(parent, [0.95 * s, 0.3, 0], [0.68 * s, 0.05, 1.55 * s], PAL.foliage2);
        break;
      }
      case 'busstation': {
        // 三芝校園交通接駁總站：現代飛翼候車天幕 + 站牌 + 2 輛精細校園接駁巴士
        kit.addBox(parent, [0, 1.35 * s, -0.45 * s], [2.7 * s, 0.16 * s, 1.15 * s], PAL.teal, [-0.08, 0, 0]);
        [-1.0, 0, 1.0].forEach((cx) => {
          kit.addCyl(parent, [cx * s, 0.78 * s, -0.45 * s], 0.07 * s, 0.09 * s, 1.15 * s, PAL.steel);
        });
        // Glass waiting shelter
        kit.addBox(parent, [0, 0.68 * s, -0.55 * s], [2.1 * s, 0.75 * s, 0.12 * s], PAL.glass, null, W);
        // 2 Detailed Shuttle Buses
        kit.addVehicle(parent, -0.68 * s, 0.26, 0.58 * s, PAL.gold, false, 0.08);
        kit.addVehicle(parent, 0.68 * s, 0.26, 0.58 * s, PAL.milk, false, -0.08);
        break;
      }
      case 'admintower': {
        // 第一、二教研行政大樓：對稱雙翼 5 層大樓 + 中央 7 層鐘樓金冠地標
        kit.addBox(parent, [0, 1.75 * s, -0.15 * s], [1.15 * s, 3.0 * s, 1.65 * s], PAL.navy);
        kit.addBox(parent, [-1.05 * s, 1.35 * s, 0.05 * s], [1.05 * s, 2.2 * s, 1.45 * s], PAL.slate);
        kit.addBox(parent, [1.05 * s, 1.35 * s, 0.05 * s], [1.05 * s, 2.2 * s, 1.45 * s], PAL.slate);
        kit.addWindowGrid(parent, 0, 1.75 * s, -0.15 * s, 0.95 * s, 2.6 * s, 1.65 * s, 5, 3);
        kit.addWindowGrid(parent, -1.05 * s, 1.35 * s, 0.05 * s, 0.88 * s, 1.9 * s, 1.45 * s, 4, 2);
        kit.addWindowGrid(parent, 1.05 * s, 1.35 * s, 0.05 * s, 0.88 * s, 1.9 * s, 1.45 * s, 4, 2);
        kit.addSphere(parent, [0, 3.45 * s, -0.15 * s], 0.38 * s, PAL.gold, [1, 1, 1], W);
        break;
      }
      case 'servicehub': {
        // 教務處與學務處服務中心：雙層挑高玻璃大廳與弧形雨遮
        kit.addBox(parent, [0, 1.18 * s, -0.1 * s], [2.4 * s, 1.85 * s, 1.6 * s], PAL.cream);
        kit.addWindowGrid(parent, 0, 1.18 * s, -0.1 * s, 2.2 * s, 1.55 * s, 1.6 * s, 3, 5);
        kit.addBox(parent, [0, 2.18 * s, -0.05 * s], [2.6 * s, 0.22 * s, 1.8 * s], PAL.teal);
        break;
      }
      case 'ecohub': {
        // 總務處與 CSR 永續校園中心：綠建築斜頂太陽能陣列 + 大型三葉風力發電機
        kit.addBox(parent, [-0.3 * s, 1.05 * s, -0.1 * s], [1.95 * s, 1.6 * s, 1.5 * s], PAL.foliage2);
        kit.addWindowGrid(parent, -0.3 * s, 1.05 * s, -0.1 * s, 1.75 * s, 1.3 * s, 1.5 * s, 2, 4);
        // Solar panel array on roof
        kit.addBox(parent, [-0.3 * s, 1.92 * s, -0.1 * s], [1.85 * s, 0.1 * s, 1.4 * s], PAL.navy, [0.24, 0, 0]);
        // Wind turbine
        kit.addCyl(parent, [1.05 * s, 1.45 * s, 0.2 * s], 0.06 * s, 0.1 * s, 2.4 * s, PAL.milk);
        for (let bIdx = 0; bIdx < 3; bIdx++) {
          const ang = (bIdx * Math.PI * 2) / 3;
          kit.addBox(parent, [1.05 * s + Math.cos(ang) * 0.42 * s, (2.65 + Math.sin(ang) * 0.42) * s, 0.32 * s], [0.85 * s, 0.08 * s, 0.04 * s], PAL.milk, [0, 0, ang]);
        }
        break;
      }
      case 'cloudpod': {
        // 馬偕雲與數位校務中樞：高科技伺服器機房大樓 + 雙衛星通訊碟盤
        kit.addBox(parent, [0, 1.25 * s, -0.1 * s], [2.25 * s, 2.0 * s, 1.6 * s], PAL.charcoal);
        kit.addWindowGrid(parent, 0, 1.25 * s, -0.1 * s, 2.0 * s, 1.7 * s, 1.6 * s, 4, 4, PAL.tealLight);
        kit.addSphere(parent, [-0.55 * s, 2.45 * s, -0.1 * s], 0.38 * s, PAL.milk, [1.25, 0.45, 1.25]);
        kit.addSphere(parent, [0.55 * s, 2.45 * s, -0.1 * s], 0.32 * s, PAL.milk, [1.25, 0.45, 1.25]);
        break;
      }
      case 'admitarch': {
        // 招生資訊中心暨 OPEN DAY 歡迎廣場：宏偉紅磚拱門 + 迎賓紅毯 + 左右接待館
        kit.addBox(parent, [-0.95 * s, 1.35 * s, 0.2 * s], [0.48 * s, 2.2 * s, 0.65 * s], PAL.brick);
        kit.addBox(parent, [0.95 * s, 1.35 * s, 0.2 * s], [0.48 * s, 2.2 * s, 0.65 * s], PAL.brick);
        kit.addBox(parent, [0, 2.55 * s, 0.2 * s], [2.65 * s, 0.48 * s, 0.8 * s], PAL.gold);
        kit.addBox(parent, [0, 1.05 * s, -0.55 * s], [2.2 * s, 1.5 * s, 1.05 * s], PAL.cream);
        kit.addWindowGrid(parent, 0, 1.05 * s, -0.55 * s, 1.95 * s, 1.2 * s, 1.05 * s, 2, 4);
        // Red carpet welcome path
        kit.addBox(parent, [0, 0.29, 0.65 * s], [0.95 * s, 0.04, 1.5 * s], PAL.redCross);
        break;
      }
      case 'hospital': {
        // 馬偕紀念醫院暨夥伴醫療體系基地：6 層現代醫療大樓 + 紅十字標誌 + 屋頂直升機停機坪 [H] + 救護車
        kit.addBox(parent, [-0.15 * s, 1.65 * s, -0.15 * s], [2.3 * s, 2.8 * s, 1.65 * s], PAL.milk);
        kit.addWindowGrid(parent, -0.15 * s, 1.65 * s, -0.15 * s, 2.1 * s, 2.4 * s, 1.65 * s, 5, 5);
        // Rooftop Helipad
        kit.addCyl(parent, [-0.15 * s, 3.12 * s, -0.15 * s], 0.78 * s, 0.78 * s, 0.1 * s, PAL.foliage);
        kit.addBox(parent, [-0.15 * s, 3.18 * s, -0.15 * s], [0.45 * s, 0.04 * s, 0.12 * s], PAL.milk);
        // Red Cross on facade
        kit.addBox(parent, [-0.15 * s, 2.65 * s, 0.72 * s], [0.52 * s, 0.16 * s, 0.06 * s], PAL.redCross);
        kit.addBox(parent, [-0.15 * s, 2.65 * s, 0.72 * s], [0.16 * s, 0.52 * s, 0.06 * s], PAL.redCross);
        kit.addVehicle(parent, 0.75 * s, 0.26, 0.95 * s, PAL.milk, true, -0.2);
        break;
      }
      case 'usrbase': {
        // USR 大學社會責任與偏鄉服務基地：溫馨木構中心 + 偏鄉巡迴醫療車 + 社區市集帳篷
        kit.addBox(parent, [-0.25 * s, 1.05 * s, -0.15 * s], [2.1 * s, 1.55 * s, 1.45 * s], PAL.woodLight);
        kit.addWindowGrid(parent, -0.25 * s, 1.05 * s, -0.15 * s, 1.85 * s, 1.25 * s, 1.45 * s, 2, 4);
        kit.addCone(parent, [-0.25 * s, 2.2 * s, -0.15 * s], 1.6 * s, 0.85 * s, PAL.coral, [0, Math.PI / 4, 0]);
        kit.addVehicle(parent, 0.82 * s, 0.26, 0.82 * s, PAL.tealLight, true, 0.3);
        break;
      }
      case 'pier':
      default: {
        // 國際醫療交流碼頭：海景交流館 + 紅白條紋燈塔 + 雙帆遠洋帆船
        kit.addBox(parent, [-0.45 * s, 1.05 * s, -0.15 * s], [1.75 * s, 1.55 * s, 1.4 * s], PAL.milk);
        kit.addWindowGrid(parent, -0.45 * s, 1.05 * s, -0.15 * s, 1.55 * s, 1.25 * s, 1.4 * s, 2, 3);
        // Striped Lighthouse
        kit.addCyl(parent, [0.85 * s, 0.85 * s, -0.25 * s], 0.28 * s, 0.36 * s, 1.2 * s, PAL.redCross);
        kit.addCyl(parent, [0.85 * s, 1.85 * s, -0.25 * s], 0.22 * s, 0.28 * s, 0.9 * s, PAL.milk);
        kit.addSphere(parent, [0.85 * s, 2.48 * s, -0.25 * s], 0.24 * s, PAL.gold, [1, 1, 1], W);
        kit.addCone(parent, [0.85 * s, 2.78 * s, -0.25 * s], 0.28 * s, 0.35 * s, PAL.redCross);
        // Sailboat at pier
        kit.addBox(parent, [0.65 * s, 0.36 * s, 0.95 * s], [0.95 * s, 0.22 * s, 0.38 * s], PAL.wood);
        kit.addPrism(parent, [0.65 * s, 0.95 * s, 0.95 * s], [0.55 * s, 0.06 * s, 0.95 * s], PAL.milk, [0, Math.PI / 2, 0]);
        break;
      }
    }
  }

  /* ------------------------------------------------------------------------
     4. Hexagonal Archipelago World Builder (Proper Island Spacing & Roads)
     ------------------------------------------------------------------------ */
  const HEX_R = 15.2;
  const HEX_STEP = 29.2;
  const BUILDING_SPREAD = 9.0; // Converts normalized [-0.55..0.68] pos into distinct island quadrants!

  function axialToWorld(q, r) {
    const x = HEX_STEP * (q + r * 0.5);
    const z = HEX_STEP * (Math.sqrt(3) / 2) * r;
    return [x, z];
  }

  function createHexCylinder(radius, height, colorHex, topTex = null) {
    const geo = new THREE.CylinderGeometry(radius, radius * 0.92, height, 6);
    const mats = [
      new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: 0xffffff, map: topTex, roughness: 0.72 }),
      new THREE.MeshStandardMaterial({ color: 0x2b3a4a, roughness: 0.9 })
    ];
    const mesh = new THREE.Mesh(geo, mats);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  function buildWorld(scene, kit) {
    const worldGroup = new THREE.Group();
    worldGroup.name = 'MMUWorld';
    scene.add(worldGroup);

    const islandMap = new Map();
    const buildingMap = new Map();
    const pickables = [];

    DATA.islands.forEach((isl, idx) => {
      const [wx, wz] = axialToWorld(isl.q, isl.r);
      const ig = new THREE.Group();
      ig.position.set(wx, 0, wz);
      ig.userData = { island: isl };
      worldGroup.add(ig);

      // Cliff lower base + top deck
      const baseRock = new THREE.Mesh(
        new THREE.CylinderGeometry(HEX_R * 0.95, HEX_R * 0.78, 3.4, 6),
        new THREE.MeshStandardMaterial({ color: 0x3b495b, roughness: 0.9 })
      );
      baseRock.position.y = -2.2;
      ig.add(baseRock);

      const topTex = makeGroundTexture(isl.ground, isl.color);
      const topDeck = createHexCylinder(HEX_R, 1.1, isl.color, topTex);
      topDeck.position.y = -0.35;
      ig.add(topDeck);

      // Central Island Plaza & Ring Walkway
      kit.addCyl(ig, [0, 0.21, 0], 2.75, 2.85, 0.06, PAL.granite);
      kit.addCyl(ig, [0, 0.25, 0], 1.45, 1.55, 0.08, isl.color);

      // ── 三芝特產「茭白筍（美人腿）」主題造景配置 ──
      // 1) 每座島嶼中央廣場正中：大型「三芝美人腿茭白筍」景觀雕塑座
      kit.addWaterBambooSculpture(ig, 0, 0.26, 0, 1.15);
      // 2) 島嶼南北側綠地：三芝水梯田茭白筍生態造景畦 + 入口迎賓茭白筍雕塑
      kit.addWaterBambooPatch(ig, 0, 0.2, -6.8, 0);
      kit.addWaterBambooPatch(ig, 0, 0.2, 6.8, Math.PI);
      kit.addSingleWaterBamboo(ig, -2.15, 0.22, 1.35, 0.92, 0.5, 0.08);
      kit.addSingleWaterBamboo(ig, 2.15, 0.22, -1.35, 0.92, -0.8, -0.08);

      // ── 島上師生休憩座椅與戶外家具配置 ──
      const parasolColors = [PAL.coral, PAL.teal, PAL.gold, PAL.brick];
      // 東西側草地：木構藤架涼亭沙發休憩區 + 露天遮陽傘咖啡座 + 野餐共學木桌椅
      kit.addPergolaLounge(ig, -6.9, 0.2, 0, Math.PI / 2);
      kit.addCafeParasolSet(ig, 6.8, 0.2, -1.1, parasolColors[idx % parasolColors.length]);
      kit.addCafeParasolSet(ig, 6.8, 0.2, 1.3, parasolColors[(idx + 1) % parasolColors.length]);
      kit.addPicnicTable(ig, -2.5, 0.2, -5.8, 0.25);
      kit.addPicnicTable(ig, 2.5, 0.2, 5.8, -0.25);
      // 中央廣場四周休閒木長椅
      for (let bAng = 0; bAng < 4; bAng++) {
        const a = (bAng * Math.PI) / 2 + Math.PI / 4;
        kit.addBench(ig, Math.cos(a) * 2.35, 0.22, Math.sin(a) * 2.35, -a + Math.PI / 2);
      }

      // Persona highlight ring around island perimeter
      const ringGeo = new THREE.RingGeometry(HEX_R * 0.94, HEX_R * 1.03, 6);
      ringGeo.rotateX(-Math.PI / 2);
      ringGeo.rotateY(Math.PI / 6);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf5b841,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.0
      });
      const personaRing = new THREE.Mesh(ringGeo, ringMat);
      personaRing.position.y = 0.24;
      ig.add(personaRing);

      // Perimeter trees, lamps, and benches
      for (let k = 0; k < 12; k++) {
        const ang = (k * Math.PI) / 6 + 0.15;
        const tx = Math.cos(ang) * (HEX_R * 0.82);
        const tz = Math.sin(ang) * (HEX_R * 0.82);
        kit.addTree(ig, tx, 0.2, tz, 0.95 + (k % 3) * 0.22, idx + k);
        if (k % 2 === 0) {
          kit.addLamp(ig, Math.cos(ang) * (HEX_R * 0.7), 0.2, Math.sin(ang) * (HEX_R * 0.7));
        } else {
          kit.addBench(ig, Math.cos(ang) * (HEX_R * 0.68), 0.2, Math.sin(ang) * (HEX_R * 0.68), -ang + Math.PI / 2);
        }
      }

      // Buildings on this island (scaled from normalized coordinates so they spread out properly!)
      isl.buildings.forEach((b) => {
        const lx = b.pos[0] * BUILDING_SPREAD;
        const lz = b.pos[1] * BUILDING_SPREAD;

        // Paved radial walkway from island center plaza to building
        const dist = Math.hypot(lx, lz);
        const ang = Math.atan2(lx, lz);
        kit.addBox(ig, [lx * 0.5, 0.21, lz * 0.5], [1.1, 0.04, dist], PAL.granite, [0, ang, 0]);
        kit.addBox(ig, [lx * 0.5, 0.22, lz * 0.5], [0.78, 0.04, dist * 0.95], PAL.slate, [0, ang, 0]);

        const bg = new THREE.Group();
        bg.position.set(lx, 0.2, lz);
        bg.userData = { building: b, island: isl };
        ig.add(bg);

        buildBuildingModel(kit, bg, b);

        // Selection ring under building
        const sRingGeo = new THREE.RingGeometry(2.35, 2.75, 32);
        sRingGeo.rotateX(-Math.PI / 2);
        const sRingMat = new THREE.MeshBasicMaterial({ color: 0xf5b841, side: THREE.DoubleSide, transparent: true, opacity: 0 });
        const sRing = new THREE.Mesh(sRingGeo, sRingMat);
        sRing.position.y = 0.06;
        bg.add(sRing);

        // Invisible hit collider for Raycaster
        const hitGeo = new THREE.BoxGeometry(4.0, 4.5, 3.6);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        hitMesh.position.y = 2.2;
        hitMesh.userData = { building: b, island: isl, group: bg };
        bg.add(hitMesh);
        pickables.push(hitMesh);

        const worldPos = new THREE.Vector3(wx + lx, 0.2, wz + lz);
        buildingMap.set(b.id, { data: b, island: isl, group: bg, selectRing: sRingMat, worldPos });
      });

      islandMap.set(isl.id, {
        data: isl,
        group: ig,
        personaRing: ringMat,
        worldPos: new THREE.Vector3(wx, 0, wz)
      });
    });

    // ── 12 座跨島景觀橋樑與島內連接幹道系統 (Inter-Island Bridges & Causeways) ──
    const islEntries = Array.from(islandMap.values());
    for (let i = 0; i < islEntries.length; i++) {
      for (let j = i + 1; j < islEntries.length; j++) {
        const A = islEntries[i];
        const B = islEntries[j];
        const dq = A.data.q - B.data.q;
        const dr = A.data.r - B.data.r;
        // 檢查六角軸座標是否為相鄰島嶼 (距離 1 單位)
        const isNeighbor =
          (Math.abs(dq) === 1 && dr === 0) ||
          (dq === 0 && Math.abs(dr) === 1) ||
          (dq === 1 && dr === -1) ||
          (dq === -1 && dr === 1);
        if (!isNeighbor) continue;

        const pA = A.worldPos;
        const pB = B.worldPos;
        const mid = pA.clone().lerp(pB, 0.5);
        const dx = pB.x - pA.x;
        const dz = pB.z - pA.z;
        const yaw = Math.atan2(dx, dz);

        // 1) 兩座島嶼內部從中央廣場通往橋頭的景觀幹道 (含白石路緣與雙向車道中線)
        [pA, pB].forEach((pOrigin, sideIdx) => {
          const dirSign = sideIdx === 0 ? 1 : -1;
          const roadCenterDist = 7.4; // 從廣場邊緣 (r=2.8) 延伸至島緣橋頭 (r=12.0)
          const roadLen = 9.2;
          const rx = pOrigin.x + Math.sin(yaw) * roadCenterDist * dirSign;
          const rz = pOrigin.z + Math.cos(yaw) * roadCenterDist * dirSign;
          const rg = new THREE.Group();
          rg.position.set(rx, 0.21, rz);
          rg.rotation.y = yaw;
          worldGroup.add(rg);

          kit.addBox(rg, [0, 0, 0], [1.72, 0.04, roadLen], PAL.granite);
          kit.addBox(rg, [0, 0.015, 0], [1.28, 0.04, roadLen], PAL.slate);
          for (let dLine = -3.6; dLine <= 3.6; dLine += 1.8) {
            kit.addBox(rg, [0, 0.03, dLine], [0.09, 0.04, 0.85], PAL.gold);
          }
        });

        // 2) 跨越海域的雙向景觀大橋本體
        const bridgeSpan = 7.6;
        const bg = new THREE.Group();
        bg.position.set(mid.x, 0.2, mid.z);
        bg.rotation.y = yaw;
        worldGroup.add(bg);

        // 海底石造橋墩 (2 座深水橋墩)
        kit.addCyl(bg, [0, -1.0, -1.85], 0.52, 0.68, 2.5, PAL.graniteDark);
        kit.addCyl(bg, [0, -1.0, 1.85], 0.52, 0.68, 2.5, PAL.graniteDark);

        // 橋面雙側引道與微拱主橋面
        kit.addBox(bg, [0, 0.14, -2.5], [2.25, 0.18, 2.7], PAL.granite, [-0.07, 0, 0]);
        kit.addBox(bg, [0, 0.14, 2.5], [2.25, 0.18, 2.7], PAL.granite, [0.07, 0, 0]);
        kit.addBox(bg, [0, 0.24, 0], [2.28, 0.2, 3.0], PAL.granite);
        // 柏油路面與金色中央分隔虛線
        kit.addBox(bg, [0, 0.28, 0], [1.52, 0.16, bridgeSpan], PAL.slate);
        for (let bz = -2.8; bz <= 2.8; bz += 1.4) {
          kit.addBox(bg, [0, 0.37, bz], [0.1, 0.03, 0.68], PAL.gold);
        }

        // 雙側石柱安全護欄與橋上景觀路燈
        [-1.02, 1.02].forEach((railX) => {
          kit.addBox(bg, [railX, 0.56, 0], [0.1, 0.1, bridgeSpan], PAL.cream);
          kit.addBox(bg, [railX, 0.38, 0], [0.08, 0.08, bridgeSpan], PAL.granite);
          for (let pz = -3.3; pz <= 3.3; pz += 1.1) {
            kit.addBox(bg, [railX, 0.44, pz], [0.14, 0.38, 0.14], PAL.graniteDark);
          }
          // 橋頭與橋中央暖光路燈
          kit.addLamp(bg, railX, 0.32, -2.6);
          kit.addLamp(bg, railX, 0.32, 2.6);
        });

        // 連接中央「01 醫學院島」的 6 座主幹道橋樑：加裝雙側白色鋼拱桁架 (Arch Truss)
        const isMainSpoke = A.data.id === 'med' || B.data.id === 'med';
        if (isMainSpoke) {
          [-1.05, 1.05].forEach((archX) => {
            kit.addTorus(bg, [archX, 0.35, 0], 1.75, PAL.teal, [0, Math.PI / 2, 0]);
            kit.addBox(bg, [archX, 1.15, -0.95], [0.07, 1.5, 0.07], PAL.milk);
            kit.addBox(bg, [archX, 1.45, 0], [0.07, 2.1, 0.07], PAL.milk);
            kit.addBox(bg, [archX, 1.15, 0.95], [0.07, 1.5, 0.07], PAL.milk);
          });
          // 橋頂橫樑
          kit.addBox(bg, [0, 2.02, 0], [2.18, 0.1, 0.14], PAL.teal);
        }
      }
    }

    // Inter-island collaboration flow tubes & bridge walker routes
    const flowTubes = [];
    DATA.flows.forEach((fl) => {
      const fromIds = Array.isArray(fl.from) ? fl.from : [fl.from];
      const toIds = Array.isArray(fl.to) ? fl.to : [fl.to];
      const a = islandMap.get(fromIds[0]);
      const b = islandMap.get(toIds[0]);
      if (!a || !b) return;

      const p0 = a.worldPos.clone().setY(0.28);
      const p2 = b.worldPos.clone().setY(0.28);
      const mid = p0.clone().lerp(p2, 0.5);
      mid.y = 0.68; // Follows the arched bridge deck!

      const curve = new THREE.QuadraticBezierCurve3(p0, mid, p2);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.09, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x56c7b9,
        emissive: 0x1d9a8c,
        emissiveIntensity: 0.65,
        transparent: true,
        opacity: 0.65
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      worldGroup.add(tube);
      flowTubes.push({ flow: fl, curve, mesh: tube });
    });

    kit.flush();
    return { worldGroup, islandMap, buildingMap, pickables, flowTubes };
  }

  /* ------------------------------------------------------------------------
     5. Sanzhi Mountain-to-Sea Environment & 4-Period Lighting
     ------------------------------------------------------------------------ */
  function createEnvironment(scene, kit) {
    const envGroup = new THREE.Group();
    envGroup.name = 'SanzhiEnvironment';
    scene.add(envGroup);

    const oceanGeo = new THREE.PlaneGeometry(560, 560, 48, 48);
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x166996,
      roughness: 0.25,
      metalness: 0.15
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.position.y = -2.25;
    ocean.receiveShadow = true;
    envGroup.add(ocean);

    // Datun Mountain Range in the North (-Z)
    const mtnGroup = new THREE.Group();
    const peaks = [
      [-70, -86, 30, 28, 0x2d5a4c],
      [-28, -94, 38, 36, 0x254d42],
      [18, -90, 34, 31, 0x2f5e4e],
      [64, -82, 28, 25, 0x356856],
      [-105, -68, 24, 20, 0x356856],
      [100, -70, 26, 22, 0x2d5a4c]
    ];
    peaks.forEach(([x, z, r, h, col]) => {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(r, h, 7),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.9, flatShading: true })
      );
      cone.position.set(x, h * 0.5 - 2.2, z);
      mtnGroup.add(cone);
    });
    envGroup.add(mtnGroup);

    // Starfield
    const starCount = 450;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.42;
      const rad = 220;
      starPos[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = rad * Math.cos(phi) + 15;
      starPos[i * 3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, transparent: true, opacity: 0 });
    const stars = new THREE.Points(starGeo, starMat);
    envGroup.add(stars);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x457b9d, 1.15);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.65);
    dirLight.position.set(42, 72, 42);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    const d = 75;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    const PRESETS = {
      dawn: {
        bg: 0x3a4f7a, fog: 0x5c6e91, ocean: 0x22577a,
        hemiSky: 0xffd6cc, hemiGround: 0x3b4254, hemiInt: 0.95,
        dirCol: 0xffb38a, dirInt: 1.3, dirPos: [65, 34, 28],
        stars: 0.15, winEmissive: 0.5
      },
      day: {
        bg: 0x7ec4e6, fog: 0x9ed8db, ocean: 0x166996,
        hemiSky: 0xffffff, hemiGround: 0x457b9d, hemiInt: 1.18,
        dirCol: 0xfffbeb, dirInt: 1.68, dirPos: [40, 74, 44],
        stars: 0.0, winEmissive: 0.12
      },
      dusk: {
        bg: 0x4a2545, fog: 0xd96b43, ocean: 0x2b3a67,
        hemiSky: 0xff9e6d, hemiGround: 0x2b2d42, hemiInt: 0.92,
        dirCol: 0xff7b47, dirInt: 1.5, dirPos: [-68, 28, 45],
        stars: 0.35, winEmissive: 0.85
      },
      night: {
        bg: 0x091326, fog: 0x0d1b33, ocean: 0x081c30,
        hemiSky: 0x3b5998, hemiGround: 0x0a1120, hemiInt: 0.5,
        dirCol: 0x93c5fd, dirInt: 0.6, dirPos: [-30, 60, -30],
        stars: 0.95, winEmissive: 1.35
      }
    };

    function applyTimePreset(mode) {
      const p = PRESETS[mode] || PRESETS.day;
      scene.background = new THREE.Color(p.bg);
      scene.fog = new THREE.FogExp2(p.fog, 0.0038);
      oceanMat.color.setHex(p.ocean);
      hemiLight.color.setHex(p.hemiSky);
      hemiLight.groundColor.setHex(p.hemiGround);
      hemiLight.intensity = p.hemiInt;
      dirLight.color.setHex(p.dirCol);
      dirLight.intensity = p.dirInt;
      dirLight.position.set(p.dirPos[0], p.dirPos[1], p.dirPos[2]);
      starMat.opacity = p.stars;

      kit.windowMats.forEach((m) => {
        m.emissiveIntensity = p.winEmissive;
      });
    }

    applyTimePreset('day');

    return {
      applyTimePreset,
      update(t) {
        ocean.position.y = -2.25 + Math.sin(t * 1.4) * 0.08;
      }
    };
  }

  /* ------------------------------------------------------------------------
     6. Q-Version Walkers & Dr. George Leslie MacKay Easter Egg
     ------------------------------------------------------------------------ */
  function createPeople(scene, world) {
    const peopleGroup = new THREE.Group();
    peopleGroup.name = 'MMUPeople';
    scene.add(peopleGroup);

    const walkers = [];
    const walkerColors = [0x38bdf8, 0xf472b6, 0x34d399, 0xfbbf24, 0xa78bfa, 0xf87171];

    world.flowTubes.forEach((ft, idx) => {
      for (let k = 0; k < 2; k++) {
        const wg = new THREE.Group();
        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.22, 0.52, 10),
          new THREE.MeshStandardMaterial({ color: walkerColors[idx % walkerColors.length] })
        );
        body.position.y = 0.26;
        const head = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 10, 10),
          new THREE.MeshStandardMaterial({ color: 0xffedd5 })
        );
        head.position.y = 0.66;
        wg.add(body, head);
        peopleGroup.add(wg);
        walkers.push({ group: wg, curve: ft.curve, offset: k * 0.5 + idx * 0.13, speed: 0.06 });
      }
    });

    // Dr. George Leslie MacKay (馬偕博士) Easter Egg Character
    const mackayGroup = new THREE.Group();
    mackayGroup.name = 'DrMacKay';
    const coat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.36, 0.9, 12),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 })
    );
    coat.position.y = 0.45;
    const mHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xfde68a })
    );
    mHead.position.y = 1.08;
    const beard = new THREE.Mesh(
      new THREE.ConeGeometry(0.23, 0.45, 10),
      new THREE.MeshStandardMaterial({ color: 0x111827 })
    );
    beard.rotation.x = Math.PI;
    beard.position.set(0, 0.88, 0.15);
    const hatBrim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.05, 12),
      new THREE.MeshStandardMaterial({ color: 0x111827 })
    );
    hatBrim.position.y = 1.28;
    const hatTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.23, 0.21, 0.34, 12),
      new THREE.MeshStandardMaterial({ color: 0x111827 })
    );
    hatTop.position.y = 1.44;
    const medBag = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.22, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x7c2d12 })
    );
    medBag.position.set(0.38, 0.44, 0.08);
    const aura = new THREE.Mesh(
      new THREE.RingGeometry(0.48, 0.68, 24),
      new THREE.MeshBasicMaterial({ color: 0xf5b841, side: THREE.DoubleSide })
    );
    aura.rotation.x = -Math.PI / 2;
    aura.position.y = 0.06;

    mackayGroup.add(coat, mHead, beard, hatBrim, hatTop, medBag, aura);
    peopleGroup.add(mackayGroup);

    // Patrol across the center plazas of the 7 islands
    const patrolPoints = DATA.islands.map((isl) => {
      const [wx, wz] = axialToWorld(isl.q, isl.r);
      return new THREE.Vector3(wx, 0.25, wz);
    });

    function update(t) {
      walkers.forEach((w) => {
        const u = (t * w.speed + w.offset) % 1;
        const pos = w.curve.getPointAt(u);
        w.group.position.copy(pos);
        w.group.position.y += Math.abs(Math.sin(t * 7 + w.offset * 10)) * 0.12;
      });

      const cycle = (t * 0.07) % patrolPoints.length;
      const i0 = Math.floor(cycle);
      const i1 = (i0 + 1) % patrolPoints.length;
      const frac = cycle - i0;
      mackayGroup.position.lerpVectors(patrolPoints[i0], patrolPoints[i1], frac);
      mackayGroup.position.y = 0.26 + Math.abs(Math.sin(t * 5)) * 0.12;
      mackayGroup.lookAt(patrolPoints[i1].x, mackayGroup.position.y, patrolPoints[i1].z);
    }

    return { mackayGroup, update };
  }

  /* ------------------------------------------------------------------------
     7. Main Bootstrap, Thumbnails & Labels
     ------------------------------------------------------------------------ */
  const stageEl = document.getElementById('stage');
  const labelsEl = document.getElementById('labels');

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stageEl.appendChild(renderer.domElement);

  const labelRenderer = new THREE.CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelsEl.appendChild(labelRenderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.5, 480);
  camera.position.set(0, 48, 72);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.maxPolarAngle = Math.PI * 0.46;
  controls.minDistance = 10;
  controls.maxDistance = 145;
  controls.target.set(0, 0, 2);

  const kit = createKit(scene);
  const world = buildWorld(scene, kit);
  const env = createEnvironment(scene, kit);
  const people = createPeople(scene, world);

  /* ------------------------------------------------------------------------
     8. Live WebGLRenderTarget Thumbnail Portraits for 27 Buildings
     ------------------------------------------------------------------------ */
  const thumbCache = new Map();
  function generateBuildingThumbnails() {
    const size = 140;
    const rt = new THREE.WebGLRenderTarget(size, size);
    const thumbCam = new THREE.PerspectiveCamera(34, 1, 0.2, 90);
    const pixelBuf = new Uint8Array(size * size * 4);
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    const imgData = ctx.createImageData(size, size);

    world.buildingMap.forEach((entry, id) => {
      const wp = entry.worldPos;
      thumbCam.position.set(wp.x + 4.4, wp.y + 3.8, wp.z + 5.2);
      thumbCam.lookAt(wp.x, wp.y + 1.35, wp.z);

      renderer.setRenderTarget(rt);
      renderer.render(scene, thumbCam);
      renderer.readRenderTargetPixels(rt, 0, 0, size, size, pixelBuf);

      for (let y = 0; y < size; y++) {
        const srcRow = (size - 1 - y) * size * 4;
        const dstRow = y * size * 4;
        for (let x = 0; x < size * 4; x++) {
          imgData.data[dstRow + x] = pixelBuf[srcRow + x];
        }
      }
      ctx.putImageData(imgData, 0, 0);
      thumbCache.set(id, c.toDataURL('image/png'));
    });

    renderer.setRenderTarget(null);
    rt.dispose();
  }

  /* ------------------------------------------------------------------------
     9. CSS2D Floating Labels + Hysteresis Collision Culling
     ------------------------------------------------------------------------ */
  const trackedLabels = [];

  // Island labels
  DATA.islands.forEach((isl) => {
    const entry = world.islandMap.get(isl.id);
    const el = document.createElement('button');
    el.className = 'island-label';
    el.innerHTML = `<span class="il-code" style="background:${isl.color}">${islCode(isl)}</span><span class="il-name">${L(isl.short)}</span>`;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      flyToIsland(isl.id);
    });
    const obj = new THREE.CSS2DObject(el);
    obj.position.set(0, 5.4, 0);
    entry.group.add(obj);
    trackedLabels.push({ el, obj, priority: 10, w: 132, h: 30, hidden: false, type: 'island', isl });
  });

  // Building pins
  DATA.islands.forEach((isl) => {
    isl.buildings.forEach((b) => {
      const entry = world.buildingMap.get(b.id);
      const el = document.createElement('button');
      el.className = 'item-pin';
      el.dataset.bid = b.id;
      el.textContent = b.sign || L(b.name);
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectBuilding(b.id);
      });
      const obj = new THREE.CSS2DObject(el);
      obj.position.set(0, 3.8, 0);
      entry.group.add(obj);
      trackedLabels.push({ el, obj, priority: 5, w: 88, h: 24, hidden: false, type: 'building', building: b });
    });
  });

  // Dr. MacKay Easter Egg Pin
  const mackayPinEl = document.createElement('button');
  mackayPinEl.className = 'mackay-tag';
  mackayPinEl.innerHTML = '🎩 馬偕博士 Dr. MacKay';
  mackayPinEl.addEventListener('click', (e) => {
    e.stopPropagation();
    openMackayEasterEgg();
  });
  const mackayPinObj = new THREE.CSS2DObject(mackayPinEl);
  mackayPinObj.position.set(0, 2.2, 0);
  people.mackayGroup.add(mackayPinObj);
  trackedLabels.push({ el: mackayPinEl, obj: mackayPinObj, priority: 20, w: 150, h: 28, hidden: false, type: 'mackay' });

  const projVec = new THREE.Vector3();
  let selectedBuildingId = null;

  function clipLabels() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const camDist = camera.position.distanceTo(controls.target);

    const uiRects = [];
    ['sidebar', 'detail', 'top-left-stack', 'hud-top', 'persona-bar'].forEach((id) => {
      const dom = document.getElementById(id);
      if (dom && !dom.hidden) {
        const r = dom.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) uiRects.push(r);
      }
    });

    const placed = [];
    const sorted = [...trackedLabels].sort((a, b) => {
      const aSel = a.building && a.building.id === selectedBuildingId ? 100 : 0;
      const bSel = b.building && b.building.id === selectedBuildingId ? 100 : 0;
      return (b.priority + bSel) - (a.priority + aSel);
    });

    sorted.forEach((lbl) => {
      const isSel = lbl.building && lbl.building.id === selectedBuildingId;
      if (lbl.type === 'building') {
        lbl.el.classList.toggle('selected', Boolean(isSel));
      }

      if (lbl.type === 'building' && camDist > 75 && !isSel) {
        lbl.el.classList.add('label-culled');
        lbl.hidden = true;
        return;
      }

      lbl.obj.getWorldPosition(projVec);
      projVec.project(camera);

      if (projVec.z > 1) {
        lbl.el.classList.add('label-culled');
        lbl.hidden = true;
        return;
      }

      const sx = (projVec.x * 0.5 + 0.5) * vw;
      const sy = (-projVec.y * 0.5 + 0.5) * vh;
      const pad = lbl.hidden ? 5 : -3;
      const box = {
        left: sx - lbl.w * 0.5 - pad,
        right: sx + lbl.w * 0.5 + pad,
        top: sy - lbl.h * 0.5 - pad,
        bottom: sy + lbl.h * 0.5 + pad
      };

      let hit = false;
      for (const u of uiRects) {
        if (box.left < u.right && box.right > u.left && box.top < u.bottom && box.bottom > u.top) {
          hit = true;
          break;
        }
      }
      if (!hit && !isSel) {
        for (const p of placed) {
          if (box.left < p.right && box.right > p.left && box.top < p.bottom && box.bottom > p.top) {
            hit = true;
            break;
          }
        }
      }

      lbl.hidden = hit;
      lbl.el.classList.toggle('label-culled', hit);
      if (!hit) placed.push(box);
    });
  }

  /* ------------------------------------------------------------------------
     10. Camera Smooth Fly-To Animation & Selection Logic
     ------------------------------------------------------------------------ */
  let camAnim = null;
  let activeIslandFilter = 'all';
  let activePersona = 'all';

  function animateCameraTo(targetPos, camOffset, duration = 750) {
    camAnim = {
      startPos: camera.position.clone(),
      startTarget: controls.target.clone(),
      endTarget: targetPos.clone(),
      endPos: targetPos.clone().add(camOffset),
      t0: performance.now(),
      duration
    };
  }

  function flyToOverview() {
    selectedBuildingId = null;
    updateSelectionUI();
    animateCameraTo(new THREE.Vector3(0, 0, 2), new THREE.Vector3(0, 48, 72), 850);
  }

  function flyToIsland(islandId) {
    const entry = world.islandMap.get(islandId);
    if (!entry) return;
    animateCameraTo(entry.worldPos.clone().setY(1.2), new THREE.Vector3(0, 22, 30), 750);
  }

  function selectBuilding(buildingId) {
    const entry = world.buildingMap.get(buildingId);
    if (!entry) return;
    selectedBuildingId = buildingId;
    animateCameraTo(entry.worldPos.clone().setY(1.5), new THREE.Vector3(5.2, 8.8, 12.8), 700);
    updateSelectionUI();
    renderDetailCard(entry.data, entry.island);
  }

  function openMackayEasterEgg() {
    const pos = people.mackayGroup.position.clone();
    animateCameraTo(pos, new THREE.Vector3(3.5, 5.5, 8.5), 700);
    const mackayStory = {
      id: 'MACKAY',
      sign: '馬偕博士',
      name: {
        zh: '馬偕博士 (George Leslie MacKay, 1844–1901)',
        en: 'Dr. George Leslie MacKay (1844–1901)'
      },
      who: {
        zh: '北台灣醫療與西式教育先驅 ·「寧願燒盡，不願銹壞」',
        en: 'Founder of MacKay Medical & Educational Mission'
      },
      plain: {
        zh: '1872 年登陸淡水，馬偕博士以拔牙與奎寧醫療走入鄉里，創設滬尾偕醫館（1880）與牛津學堂（1882）。今日馬偕醫學大學承襲「哪裡有需要，就往哪裡去」的奉獻精神，在三芝山海校園培育兼具仁心與專業的醫護健康人才。',
        en: 'Landing in Tamsui in 1872, Dr. MacKay combined medical relief with holistic education, founding Hobe MacKay Clinic (1880) and Oxford College (1882). Today, Mackay Medical University inherits his spirit across its 3 colleges.'
      },
      facts: [
        { zh: '1872 年 3 月 9 日登陸淡水，展開近 30 年北台灣醫療傳道與教育志業', en: 'Landed in Tamsui on March 9, 1872, pioneering medical care and education', tile: { zh: '1872 淡水登陸', en: 'Since 1872' } },
        { zh: '座右銘「Rather burn out than rust out（寧願燒盡，不願銹壞）」為本校核心校訓精神', en: 'Motto: "Rather burn out than rust out"', tile: { zh: '焚而不燬', en: 'Core Motto' } },
        { zh: '串聯馬偕紀念醫院（台北、淡水、新竹、台東）四院區與三芝大學校園', en: 'Unites 4 MacKay Memorial Hospital branches with the Sanzhi campus', tile: { zh: '馬偕醫療網', en: 'MMH Network' } }
      ],
      flows: ['F3', 'F5'],
      url: 'https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268593124160844054'
    };
    renderDetailCard(mackayStory, DATA.islands[3]);
  }

  function updateSelectionUI() {
    world.buildingMap.forEach((entry, id) => {
      entry.selectRing.opacity = id === selectedBuildingId ? 0.92 : 0.0;
    });
    document.querySelectorAll('.building-card').forEach((card) => {
      card.classList.toggle('selected', card.dataset.id === selectedBuildingId);
    });
    if (!selectedBuildingId) {
      document.getElementById('detail').hidden = true;
    }
  }

  /* ------------------------------------------------------------------------
     11. Render Detail Card (#detail) — 100% Clean Bilingual Binding
     ------------------------------------------------------------------------ */
  function renderDetailCard(b, isl) {
    const detailEl = document.getElementById('detail');
    detailEl.hidden = false;

    const thumbUrl = thumbCache.get(b.id) || thumbCache.get('mk-chapel') || '';
    document.getElementById('detail-preview').innerHTML = thumbUrl
      ? `<img src="${thumbUrl}" alt="${L(b.name)}" />`
      : '';

    const badgeEl = document.getElementById('detail-island-badge');
    badgeEl.textContent = `${islCode(isl)} ${L(isl.short)}`;
    badgeEl.style.background = isl.color || '#1d9a8c';

    document.getElementById('detail-code').textContent = b.sign || `#${b.id}`;
    document.getElementById('detail-title').textContent = L(b.name);
    document.getElementById('detail-who').textContent = L(b.who);
    document.getElementById('detail-plain').textContent = L(b.plain);

    const factsEl = document.getElementById('detail-facts');
    factsEl.innerHTML = (b.facts || []).map((f) => {
      const tileText = f && f.tile ? L(f.tile) : '';
      const pill = tileText ? `<span style="display:inline-block;background:rgba(245,184,65,0.2);color:var(--mmu-gold);border:1px solid rgba(245,184,65,0.4);border-radius:5px;padding:1px 6px;font-size:10.5px;font-weight:700;margin-right:6px;">${tileText}</span>` : '';
      return `<li>${pill}${L(f)}</li>`;
    }).join('');

    const flowsEl = document.getElementById('detail-flows');
    const relatedFlows = DATA.flows.filter((fl) => (b.flows || []).includes(fl.id));
    flowsEl.innerHTML = relatedFlows.map((fl) => `
      <div class="flow-tag">
        <strong>🔗 跨島跨域協作：${L(fl.badge)}</strong>
        <span>${L(fl.text)}</span>
      </div>
    `).join('');

    const linkEl = document.getElementById('detail-official-link');
    linkEl.href = b.url || isl.url || 'https://www.mmu.edu.tw/';
  }

  /* ------------------------------------------------------------------------
     12. Sidebar 3 Tabs & Persona Bar Rendering (Simplified & Mapped)
     ------------------------------------------------------------------------ */
  const allBuildingsFlat = [];
  DATA.islands.forEach((isl) => {
    isl.buildings.forEach((b) => allBuildingsFlat.push({ b, isl }));
  });

  function renderSidebarIslandsTab() {
    const chipsEl = document.getElementById('island-chips');
    chipsEl.innerHTML = [
      `<button class="island-chip ${activeIslandFilter === 'all' ? 'active' : ''}" data-isl="all">${currentLang === 'en' ? 'All 7 Islands (27)' : '全部 7 島 (27)'}</button>`,
      ...DATA.islands.map((isl) => `
        <button class="island-chip ${activeIslandFilter === isl.id ? 'active' : ''}" data-isl="${isl.id}">
          ${islCode(isl)} ${L(isl.short)}
        </button>
      `)
    ].join('');

    chipsEl.querySelectorAll('.island-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeIslandFilter = btn.dataset.isl;
        if (activeIslandFilter !== 'all') flyToIsland(activeIslandFilter);
        else flyToOverview();
        renderSidebarIslandsTab();
      });
    });

    const query = (document.getElementById('building-search').value || '').trim().toLowerCase();
    const listEl = document.getElementById('buildings-list');
    let html = '';

    DATA.islands.forEach((isl) => {
      if (activeIslandFilter !== 'all' && activeIslandFilter !== isl.id) return;
      const matched = isl.buildings.filter((b) => {
        if (!query) return true;
        return (
          L(b.name).toLowerCase().includes(query) ||
          L(b.who).toLowerCase().includes(query) ||
          L(b.plain).toLowerCase().includes(query) ||
          (b.sign || '').toLowerCase().includes(query) ||
          b.id.toLowerCase().includes(query)
        );
      });
      if (!matched.length) return;

      html += `
        <div class="island-group-header" data-isl="${isl.id}" style="border-left-color: ${isl.color}">
          <div>
            <div class="island-group-title">${islCode(isl)} · ${L(isl.short)}</div>
            <div class="island-group-sub">${L(isl.vision || isl.summary)}</div>
          </div>
          <span style="font-size:11px;color:var(--mmu-gold);flex-shrink:0;">飛往島嶼 ↗</span>
        </div>
      `;

      matched.forEach((b) => {
        const thumb = thumbCache.get(b.id) || '';
        const isSel = b.id === selectedBuildingId ? 'selected' : '';
        html += `
          <button class="building-card ${isSel}" data-id="${b.id}">
            <div class="b-thumb">
              ${thumb ? `<img src="${thumb}" alt="${L(b.name)}" loading="lazy" />` : ''}
              <span class="b-thumb-code">${b.sign || b.id}</span>
            </div>
            <div class="b-info">
              <div class="b-name">${L(b.name)}</div>
              <div class="b-who">${L(b.who)}</div>
              <div class="b-plain">${L(b.plain)}</div>
            </div>
          </button>
        `;
      });
    });

    listEl.innerHTML = html || `<div style="padding:20px;text-align:center;color:var(--text-muted)">找不到符合「${query}」的校園地標</div>`;

    listEl.querySelectorAll('.island-group-header').forEach((hdr) => {
      hdr.addEventListener('click', () => flyToIsland(hdr.dataset.isl));
    });
    listEl.querySelectorAll('.building-card').forEach((card) => {
      card.addEventListener('click', () => selectBuilding(card.dataset.id));
    });
  }

  let activeNewsCat = 'all';
  function renderSidebarNewsTab() {
    const cats = ['all', '招生', '榮譽', '活動', '公告'];
    const chipsEl = document.getElementById('news-chips');
    chipsEl.innerHTML = cats.map((c) => `
      <button class="island-chip ${activeNewsCat === c ? 'active' : ''}" data-cat="${c}">
        ${c === 'all' ? (currentLang === 'en' ? 'All News' : '全部焦點') : c}
      </button>
    `).join('');

    chipsEl.querySelectorAll('.island-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeNewsCat = btn.dataset.cat;
        renderSidebarNewsTab();
      });
    });

    const listEl = document.getElementById('news-list');
    const items = DATA.news.filter((n) => activeNewsCat === 'all' || n.cat === activeNewsCat);
    listEl.innerHTML = items.map((n) => {
      const isl = DATA.islands.find((i) => i.id === n.island);
      return `
        <div class="news-card">
          <div class="news-meta">
            <span class="news-cat cat-${n.cat}">${n.cat}</span>
            <span class="news-date">${n.date}</span>
          </div>
          <a href="${n.url}" target="_blank" rel="noopener" class="news-title" style="text-decoration:none;color:inherit">
            ${L(n)} ↗
          </a>
          ${isl ? `<button class="news-island-jump" data-isl="${isl.id}">📍 定位至 ${islCode(isl)} ${L(isl.short)}</button>` : ''}
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.news-island-jump').forEach((btn) => {
      btn.addEventListener('click', () => flyToIsland(btn.dataset.isl));
    });
  }

  function renderSidebarSystemsTab() {
    const container = document.getElementById('systems-list');
    const roleLabels = {
      prospect: currentLang === 'en' ? '🎓 Admissions & Prospective Students' : '🎓 考生與家長常用入口',
      student: currentLang === 'en' ? '📚 Current Student Digital Systems' : '📚 在校學生數位系統',
      staff: currentLang === 'en' ? '💼 Faculty & Staff Portals' : '💼 教職員工專區',
      all: currentLang === 'en' ? '🌐 Partner Hospitals & Public Info' : '🌐 醫療體系與校務公開'
    };

    let html = '';
    ['prospect', 'student', 'staff', 'all'].forEach((roleKey) => {
      const group = DATA.portals.filter((p) => (p.role || 'all') === roleKey);
      if (!group.length) return;
      html += `<div class="section-heading">${roleLabels[roleKey]}</div><div class="portal-grid">`;
      group.forEach((p) => {
        html += `
          <a class="portal-item" href="${p.url}" target="_blank" rel="noopener">
            <span class="portal-item-title">${L(p)} ↗</span>
            <span class="portal-item-role">${currentLang === 'en' ? 'Official MMU Portal' : '點擊前往馬偕官網系統'}</span>
          </a>
        `;
      });
      html += `</div>`;
    });

    html += `<div class="section-heading" style="margin-top:12px">🏛️ ${currentLang === 'en' ? 'Administrative Offices (Main: 02-2636-0303)' : '行政處室與分機總覽 (總機 02-2636-0303)'}</div>`;
    DATA.offices.forEach((o) => {
      html += `
        <div class="office-card">
          <div class="office-main">
            <div class="office-name">${L(o)}</div>
          </div>
          <div class="office-actions">
            <span class="office-ext">${o.ext}</span>
            <a class="office-link" href="${o.url}" target="_blank" rel="noopener">${currentLang === 'en' ? 'Visit ↗' : '專頁 ↗'}</a>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function renderPersonaBar() {
    const barEl = document.getElementById('persona-bar');
    barEl.innerHTML = DATA.personas.map((p) => {
      const icon = PERSONA_ICONS[p.id] || '🧭';
      return `
        <button class="persona-btn ${activePersona === p.id ? 'active' : ''}" data-persona="${p.id}">
          <span>${icon} ${L(p.name)}</span>
        </button>
      `;
    }).join('');

    barEl.querySelectorAll('.persona-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activePersona = btn.dataset.persona;
        const pObj = DATA.personas.find((x) => x.id === activePersona);

        world.islandMap.forEach((entry, islId) => {
          const isMatch = activePersona !== 'all' && pObj && pObj.islands.includes(islId);
          entry.personaRing.opacity = isMatch ? 0.88 : 0.0;
        });

        const linksStrip = document.getElementById('persona-links');
        if (pObj && pObj.quickLinks && pObj.quickLinks.length && activePersona !== 'all') {
          const icon = PERSONA_ICONS[pObj.id] || '🧭';
          linksStrip.hidden = false;
          linksStrip.innerHTML = `
            <span class="persona-links-label">${icon} ${L(pObj.name)}：</span>
            ${pObj.quickLinks.map((ql) => `<a class="persona-quick-link" href="${ql.url}" target="_blank" rel="noopener">${L(ql)} ↗</a>`).join('')}
          `;
        } else {
          linksStrip.hidden = true;
        }
        renderPersonaBar();
      });
    });
  }

  /* ------------------------------------------------------------------------
     13. Ticker, Raycasting, Language Switch & Event Listeners
     ------------------------------------------------------------------------ */
  let tickerIdx = 0;
  function updateTicker() {
    const t = DATA.tickers[tickerIdx % DATA.tickers.length];
    document.getElementById('ticker-tag').textContent = t.tag;
    document.getElementById('ticker-text').textContent = L(t);
    document.getElementById('ticker-pill').href = t.url;
  }
  updateTicker();
  setInterval(() => {
    tickerIdx = (tickerIdx + 1) % DATA.tickers.length;
    updateTicker();
  }, 6500);

  document.getElementById('ticker-next').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    tickerIdx = (tickerIdx + 1) % DATA.tickers.length;
    updateTicker();
  });

  // Pointer Raycasting on 3D Stage
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downPos = { x: 0, y: 0 };

  renderer.domElement.addEventListener('pointerdown', (e) => {
    downPos = { x: e.clientX, y: e.clientY };
  });

  renderer.domElement.addEventListener('pointerup', (e) => {
    const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
    if (dist > 6) return;

    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(world.pickables, false);
    if (hits.length > 0) {
      const b = hits[0].object.userData.building;
      if (b) selectBuilding(b.id);
    }
  });

  // Top HUD Controls
  document.querySelectorAll('[data-time]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-time]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      env.applyTimePreset(btn.dataset.time);
    });
  });

  document.getElementById('btn-overview').addEventListener('click', flyToOverview);
  document.getElementById('btn-mackay').addEventListener('click', openMackayEasterEgg);

  document.getElementById('btn-lang').addEventListener('click', () => {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    document.getElementById('btn-lang').textContent = currentLang === 'zh' ? 'EN / 中文' : '中文 / EN';
    document.querySelector('.brand-title').textContent = L(DATA.meta.schoolName);
    document.querySelector('.brand-sub').textContent = L(DATA.meta.motto);
    trackedLabels.forEach((lbl) => {
      if (lbl.type === 'island' && lbl.isl) {
        lbl.el.querySelector('.il-name').textContent = L(lbl.isl.short);
      } else if (lbl.type === 'building' && lbl.building) {
        lbl.el.textContent = currentLang === 'en' ? L(lbl.building.name).split('(')[0].trim() : (lbl.building.sign || L(lbl.building.name));
      }
    });
    updateTicker();
    renderSidebarIslandsTab();
    renderSidebarNewsTab();
    renderSidebarSystemsTab();
    renderPersonaBar();
    if (selectedBuildingId && world.buildingMap.has(selectedBuildingId)) {
      const entry = world.buildingMap.get(selectedBuildingId);
      renderDetailCard(entry.data, entry.island);
    }
  });

  // Sidebar Tabs
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      const targetTab = btn.dataset.tab;
      document.querySelectorAll('.tab-panel').forEach((p) => {
        p.hidden = p.id !== `panel-${targetTab}`;
      });
    });
  });

  // Collapse / Expand Sidebar
  document.getElementById('sidebar-collapse').addEventListener('click', () => {
    document.body.classList.add('sidebar-collapsed');
  });
  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.body.classList.remove('sidebar-collapsed');
  });

  // Search Box
  const searchInput = document.getElementById('building-search');
  searchInput.addEventListener('input', renderSidebarIslandsTab);
  document.getElementById('search-clear').addEventListener('click', () => {
    searchInput.value = '';
    renderSidebarIslandsTab();
  });

  // Detail Card Navigation & Close
  document.getElementById('detail-close').addEventListener('click', () => {
    selectedBuildingId = null;
    updateSelectionUI();
  });

  function stepBuilding(delta) {
    const idx = allBuildingsFlat.findIndex((item) => item.b.id === selectedBuildingId);
    const nextIdx = idx < 0 ? 0 : (idx + delta + allBuildingsFlat.length) % allBuildingsFlat.length;
    selectBuilding(allBuildingsFlat[nextIdx].b.id);
  }
  document.getElementById('detail-prev').addEventListener('click', () => stepBuilding(-1));
  document.getElementById('detail-next').addEventListener('click', () => stepBuilding(1));

  // Help Modal
  const helpModal = document.getElementById('help-modal');
  document.getElementById('btn-help').addEventListener('click', () => {
    helpModal.hidden = false;
  });
  document.getElementById('help-close').addEventListener('click', () => {
    helpModal.hidden = true;
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!helpModal.hidden) {
        helpModal.hidden = true;
      } else if (selectedBuildingId) {
        selectedBuildingId = null;
        updateSelectionUI();
      }
    } else if (e.key === 'ArrowRight' && selectedBuildingId) {
      stepBuilding(1);
    } else if (e.key === 'ArrowLeft' && selectedBuildingId) {
      stepBuilding(1 * -1);
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ------------------------------------------------------------------------
     14. Initialize Portraits, Render UI & Start Main Animation Loop
     ------------------------------------------------------------------------ */
  renderer.render(scene, camera);
  generateBuildingThumbnails();
  renderSidebarIslandsTab();
  renderSidebarNewsTab();
  renderSidebarSystemsTab();
  renderPersonaBar();

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    if (camAnim) {
      const u = Math.min(1, (performance.now() - camAnim.t0) / camAnim.duration);
      const ease = 1 - Math.pow(1 - u, 3);
      camera.position.lerpVectors(camAnim.startPos, camAnim.endPos, ease);
      controls.target.lerpVectors(camAnim.startTarget, camAnim.endTarget, ease);
      if (u >= 1) camAnim = null;
    }

    controls.update();
    env.update(elapsed);
    people.update(elapsed);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    clipLabels();
  }
  animate();
})();
