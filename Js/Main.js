import { getProducts } from "./Utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  SetMenuViewControls();
  SetMenuHeaderControls();
  SetSubMenuControls();
  SetCollapseMenuControls();
  SetBannersControls();
  CheckForToIndexButtons();
  SetCarModalControls();
});

const SetMenuViewControls = () => {
  const BurgerIcon = document.getElementById("BurgerIcon");
  const MenuContainer = document.getElementById("MenuContainer");
  const CloseMenu = document.getElementById("CloseMenu");

  const toggleMenu = () => {
    MenuContainer.classList.toggle("Disabled");

    if (!MenuContainer.classList.contains("Disabled")) {
      document.querySelector("body").classList.add("NoScroll");
    } else {
      document.querySelector("body").classList.remove("NoScroll");
    }
  };

  BurgerIcon.addEventListener("click", toggleMenu);
  CloseMenu.addEventListener("click", toggleMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !MenuContainer.classList.contains("Disabled")) {
      toggleMenu();
    }
  });

  window.addEventListener("popstate", () => {
    if (!MenuContainer.classList.contains("Disabled")) {
      toggleMenu();
    }
  });
};

const SetBannersControls = () => {
  const banners = document.querySelectorAll(".BannerTitleFade");
  banners.forEach((banner) => {
    banner.addEventListener("click", () => {
      window.scrollTo(0, document.body.scrollHeight);
      SetProductsSlider(banner.id.split("-")[0]);
    });
  });
};

const SetCarModalControls = async () => {
  // Abre el modal
  const openCartBtn = document.getElementById("openCartBtn");
  const cartModal = document.getElementById("cartModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cartItemsContainer = document.getElementById("cartItems");
  const totalPriceSpan = document.getElementById("totalPrice");

  // Función para abrir el modal
  openCartBtn.addEventListener("click", () => {
    cartModal.style.display = "block";
    cartModal.style.overflowY = "auto";
    document.querySelector("body").classList.add("NoScroll");
    displayCartItems();
  });

  // Función para cerrar el modal
  closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
    document.querySelector("body").classList.remove("NoScroll");
  });

  // Función para mostrar los productos del carrito
  const displayCartItems = async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const products = await getProducts();

    cartItemsContainer.innerHTML = ""; // Limpiar el contenedor de productos
    let totalPrice = 0;

    console.log(cart);

    cart.forEach((item) => {
      // Buscar el producto según su tipo y ID
      console.log(products.products[item.type]);
      const product = products.products[item.type].find(
        (p) => p.sku === item.id
      );

      if (product) {
        // Crear el elemento para el producto
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        const productImage = document.createElement("img");
        productImage.src = product.image;
        const productName = document.createElement("h4");
        productName.textContent = product.name;
        const productPrice = document.createElement("span");
        productPrice.textContent = `$${(product.price * item.cant).toFixed(2)}`;

        // Añadir la cantidad y el nombre del producto
        const itemDetails = document.createElement("div");
        itemDetails.classList.add("cart-item-details");
        itemDetails.appendChild(productName);
        itemDetails.appendChild(document.createTextNode(`x${item.cant}`));

        // Añadir imagen y detalles
        cartItem.appendChild(productImage);
        cartItem.appendChild(itemDetails);
        cartItem.appendChild(productPrice);

        // Añadir al contenedor del carrito
        cartItemsContainer.appendChild(cartItem);

        // Sumar el total
        totalPrice += product.price * item.cant;
      }
    });

    // Actualizar el precio total
    totalPriceSpan.textContent = totalPrice.toFixed(2);

    document.getElementById("applyCouponBtn").addEventListener("click", (e) => {
      e.preventDefault();

      const couponInput = document.getElementById("couponInput");
      const couponCode = couponInput.value.trim();

      // Verificar si el cupón ya fue utilizado
      let couponsUsed = localStorage.getItem("couponsUsed") || "[]";
      couponsUsed = JSON.parse(couponsUsed);

      if (couponsUsed.includes(couponCode)) {
        alert("El cupón ya fue utilizado");
        return;
      }

      // Obtener los cupones disponibles
      const coupons = products.coupons;

      // Verificar si el cupón es válido
      const coupon = coupons.find((c) => c.code === couponCode);

      if (coupon) {
        const discount = coupon.discount; // Porcentaje de descuento
        const total = parseFloat(
          document.getElementById("totalPrice").textContent
        ); // Convertir texto a número

        // Calcular nuevo total
        const newTotal = total - (total * discount) / 100;

        // Actualizar el total en el DOM
        document.getElementById("totalPrice").textContent = newTotal.toFixed(2);

        // Guardar el nuevo total en el localStorage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        localStorage.setItem(
          "cart",
          JSON.stringify({ ...cart, total: newTotal })
        );

        // Guardar el cupón como usado
        couponsUsed.push(couponCode);
        localStorage.setItem("couponsUsed", JSON.stringify(couponsUsed));

        alert("Cupón aplicado con éxito");
      } else {
        alert("Cupón no válido");
      }
    });
  };
};

const SetMenuHeaderControls = () => {
  const MenuHeaderOptions = document.querySelectorAll(".MenuHeaderOption");
  for (let index = 0; index < MenuHeaderOptions.length; index++) {
    MenuHeaderOptions[index].addEventListener("click", () => {
      const MenuSelecteId = `${MenuHeaderOptions[index].id}Options`;
      const SelectedMenu = document.getElementById(MenuSelecteId);
      const MenuOptions = document.querySelectorAll(".MenuOptions");

      MenuHeaderOptions.forEach((option) => {
        option.classList.remove("Selected");
      });
      MenuOptions.forEach((option) => {
        option.classList.remove("SelectedMenu");
      });

      MenuHeaderOptions[index].classList.add("Selected");
      SelectedMenu.classList.add("SelectedMenu");
    });
  }
};

const SetSubMenuControls = () => {
  const SubMenus = document.querySelectorAll(".SubMenuOption");
  console.log(SubMenus.length);
  SubMenus.forEach((SubMenu) => {
    SubMenu.addEventListener("click", () => {
      const Menu = document.getElementById("Menu");
      const SubSubMenu = SubMenu.querySelector(".SubSubMenu");
      SubSubMenu.classList.remove("Disabled");

      const MenuBackButton = document.getElementById("MenuBackButton");
      const NewMenuBackButton = MenuBackButton.cloneNode(true);

      MenuBackButton.parentNode.replaceChild(NewMenuBackButton, MenuBackButton);

      NewMenuBackButton.querySelector("h3").textContent =
        "Volver a " +
        document.querySelector("#MenuHeadersContainer .Selected h3")
          .textContent;

      Menu.scrollTo(0, 0);
      Menu.style.overflowY = "hidden";

      NewMenuBackButton.addEventListener("click", () => {
        SubSubMenu.classList.add("Disabled");
        MenuBackButton.querySelector("h3").textContent = "Ir al Inicio";
        NewMenuBackButton.parentNode.replaceChild(
          MenuBackButton,
          NewMenuBackButton
        );
        Menu.style.overflowY = "auto";
      });
    });
  });
};

const SetCollapseMenuControls = () => {
  const SubSubMenuOptions = document.querySelectorAll(".SubSubMenuOption");
  SubSubMenuOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const CollapseMenu = option.querySelector(".CollapseMenu");
      const CollapseMenuArrow = option.querySelector(".CollapseMenuArrow");
      if (CollapseMenu !== null) {
        CollapseMenu.classList.toggle("Disabled");
        option.style.flexDirection = CollapseMenu.classList.contains("Disabled")
          ? "row"
          : "column";

        CollapseMenuArrow.style.transformOrigin = "center";
        CollapseMenuArrow.style.transform = CollapseMenu.classList.contains(
          "Disabled"
        )
          ? "rotate(0deg) translateY(0)"
          : "rotate(90deg) translateY(-15px)";
        CollapseMenuArrow.style.transition = "transform 0.3s ease-in-out";
      } else return;
    });
  });

  const CollapseMenuOptions = document.querySelectorAll(".CollapseMenuOption");
  CollapseMenuOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });
};

const CheckForToIndexButtons = () => {
  const ToIndex = document.querySelectorAll(".ToIndex");

  for (let index = 0; index < ToIndex.length; index++) {
    ToIndex[index].addEventListener("click", () => {
      window.location.href = "Index.html";
    });
  }
};

let lastType = "";
const SetProductsSlider = async (type) => {
  const sliderWrapper = document.getElementById("slider-wrapper");

  if (lastType === type) {
    sliderWrapper.classList.add("Disabled");
    return;
  }

  lastType = type;
  sliderWrapper.classList.remove("Disabled");

  const products = await getProducts();
  const productList = products.products[type];

  const sliderContainer = document.getElementById("ProductsSlider");

  sliderContainer.innerHTML = "";
  sliderContainer.innerHTML = productList
    .map(
      (product) => `
    <div class="slider-item">
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <div class="FlexContainer HalfWidth Row">
        <p>precio: $${product.price}</p>
        <p>compara: $${product.comparePrice}</p>
      </div>
      <h4>${product.description}</h4>
      <h5 id="AddToCart" data-product-id="${product.sku}" data-product-type="${type}">
        Agregar al carrito</h5>
    </div>
  `
    )
    .join("");

  // Inicializar variables
  let currentIndex = 0;
  const itemsCount = productList.length;
  const itemWidth = sliderWrapper.offsetWidth;

  // Botones de navegación
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");

  // Actualizar posición del slider
  function updateSliderPosition() {
    sliderContainer.style.transform = `translateX(-${
      currentIndex * itemWidth
    }px)`;
  }

  // Botón siguiente
  nextBtn.addEventListener("click", () => {
    // Limitar el movimiento a la derecha
    if (currentIndex < itemsCount / 3 - 1) {
      currentIndex++;
      updateSliderPosition();
    }
  });

  // Botón anterior
  prevBtn.addEventListener("click", () => {
    // Limitar el movimiento a la izquierda
    if (currentIndex > 0) {
      currentIndex--;
      updateSliderPosition();
    }
  });

  let isDragging = false; // Estado para saber si estamos arrastrando
  let startX; // Posición inicial del ratón
  let scrollLeft; // Posición de desplazamiento inicial del slider

  // Detectar cuando se empieza a hacer drag
  sliderWrapper.addEventListener("mousedown", (e) => {
    isDragging = true; // Inicia el drag
    startX = e.pageX - sliderWrapper.offsetLeft; // Guarda la posición inicial del ratón
    scrollLeft = sliderWrapper.scrollLeft; // Guarda la posición actual del scroll
    sliderWrapper.style.cursor = "grabbing"; // Cambia el cursor a "agarrando"
  });

  // Detectar cuando se está arrastrando
  sliderWrapper.addEventListener("mousemove", (e) => {
    if (!isDragging) return; // Si no estamos arrastrando, no hacer nada

    const moveX = e.pageX - sliderWrapper.offsetLeft; // Calcula el desplazamiento del ratón
    const distance = moveX - startX;
    if (distance < 0) {
      nextBtn.click();
    } else {
      prevBtn.click();
    }
  });

  // Detectar cuando se termina el drag
  sliderWrapper.addEventListener("mouseup", () => {
    isDragging = false; // Termina el drag
    sliderWrapper.style.cursor = "grab"; // Vuelve al cursor original
  });

  // Detectar cuando se sale del área del slider (si el mouse se va sin soltar el clic)
  sliderWrapper.addEventListener("mouseleave", () => {
    if (isDragging) {
      isDragging = false;
      sliderWrapper.style.cursor = "grab";
    }
  });

  const addToCart = document.querySelectorAll("#AddToCart");
  addToCart.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      const productType = button.getAttribute("data-product-type");
      addProductToCart(productType, productId);
    });
  });
};

const addProductToCart = (productType, productId) => {
  // Obtener el carrito desde localStorage (o un array vacío si no existe)
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Buscar si el producto ya está en el carrito
  const existingProduct = cart.find(
    (product) => product.type === productType && product.id === productId
  );

  if (existingProduct) {
    // Si el producto ya está en el carrito, incrementar su cantidad
    existingProduct.cant += 1;
  } else {
    // Si el producto no está en el carrito, agregarlo con cantidad 1
    const newProduct = {
      type: productType,
      id: productId,
      cant: 1,
    };
    cart.push(newProduct);
  }

  console.log(cart);

  // Guardar el carrito actualizado en localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
};
