const blogs = [
  {
    title: "Top 5 Gaming Accessories in 2026",
    description: "Discover the must-have gaming accessories that every gamer should own in 2026.",
    date: "Jan 20, 2026",
    image: "https://www.atulhost.com/wp-content/uploads/2023/12/gaming-laptops.jpg",
  },
  {
    title: "How Technology Is Changing E-Commerce",
    description: "AI, AR & next-gen tech are transforming online shopping like never before.",
    date: "Jan 18, 2026",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
  {
    title: "Best Headphones for Competitive Gaming",
    description: "We tested multiple gaming headphones — here are the best picks for pro gamers.",
    date: "Jan 15, 2026",
    image: "https://static1.pocketlintimages.com/wordpress/wp-content/uploads/2023/01/roccat-syn-max-air.jpg",
  }
];

const blogContainer = document.getElementById("blogContainer");

blogs.forEach(blog => {
  const card = document.createElement("div");
  card.className = "blog-card";

  card.innerHTML = `
    <img src="${blog.image}" alt="Blog Image">
    <div class="blog-content">
      <div class="blog-meta">${blog.date}</div>
      <h3>${blog.title}</h3>
      <p>${blog.description}</p>
      <a href="#" class="read-more">Read More</a>
    </div>
  `;

  blogContainer.appendChild(card);
});
