// components.js - Pure DOM Component Factories (100% Safe from XSS)
export type ButtonProps = {
    text: string;
    onClick?: (event :MouseEvent) => void;
    className?: string;
};
export function Button({ text, onClick, className = 'btn-primary' } : ButtonProps) :HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = `btn ${className}`;
  btn.textContent = text; // Safe assignment: treats input purely as plain text
  
  if (typeof onClick === 'function') {
    btn.addEventListener('click', onClick);
  }
  
  return btn;
}
type CardProps = {
    title: string;
    description: string;
    category: string;
    onClick?: () => void;
};
export function Card({ title, description, category, onClick }:CardProps) : HTMLElement {
  const card = document.createElement('article');
  card.className = 'card';

  const heading = document.createElement('h3');
  heading.className = 'card-title';
  heading.textContent = title;

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = description;

  const badge = document.createElement('span');
  badge.className = 'card-badge';
  badge.textContent = category;

  card.appendChild(badge);
  card.appendChild(heading);
  card.appendChild(desc);

  if (typeof onClick === 'function') {
    card.classList.add('card-interactive');
    card.addEventListener('click', onClick);
  }

  return card;
}
type ModalProps = {
  title : string;
  bodyNode : HTMLElement;
  onClose : ()=> void;
}
export function Modal({ title, bodyNode, onClose } : ModalProps) : HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog';

  const header = document.createElement('div');
  header.className = 'modal-header';

  const titleElem = document.createElement('h2');
  titleElem.textContent = title;

  const closeBtn = Button({
    text: '✕',
    className: 'btn-close',
    onClick: onClose
  });

  header.appendChild(titleElem);
  header.appendChild(closeBtn);

  const body = document.createElement('div');
  body.className = 'modal-body';
  body.appendChild(bodyNode);

  dialog.appendChild(header);
  dialog.appendChild(body);
  overlay.appendChild(dialog);

  // Close when clicking outside the dialog content
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay && typeof onClose === 'function') {
      onClose();
    }
  });

  return overlay;
}
type NavbarProps = {
    router: {
        navigate: (path: string) => void;
    };
};
export function Navbar({ router } : NavbarProps) : HTMLElement{

    const nav = document.createElement("nav");
    nav.className = "navbar";

    const logo = document.createElement("a");
    logo.textContent = "Recipe Browser";
    logo.href = "/";
    logo.dataset.link = "true";

    logo.addEventListener("click", (event) => {
        event.preventDefault();
        router.navigate("/");
    });

    const homeLink = document.createElement("a");
    homeLink.textContent = "Home";
    homeLink.href = "/";
    homeLink.dataset.link = "true";

    homeLink.addEventListener("click", (event) => {
        event.preventDefault();
        router.navigate("/");
    });

    const recipesLink = document.createElement("a");
    recipesLink.textContent = "Recipes";
    recipesLink.href = "/list";
    recipesLink.dataset.link = "true";

    recipesLink.addEventListener("click", (event) => {
        event.preventDefault();
        router.navigate("/list");
    });

    const settingsLink = document.createElement("a");
    settingsLink.textContent = "Settings";
    settingsLink.href = "/settings";
    settingsLink.dataset.link = "true";

    settingsLink.addEventListener("click", (event) => {
        event.preventDefault();
        router.navigate("/settings");
    });

    nav.appendChild(logo);
    nav.appendChild(homeLink);
    nav.appendChild(recipesLink);
    nav.appendChild(settingsLink);

    return nav;
}