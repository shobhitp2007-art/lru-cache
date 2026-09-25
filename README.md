# LRU Cache Visualizer

An interactive web-based visualization tool for understanding how a **Least Recently Used (LRU) Cache** works.

The project provides a modern interface where users can perform cache operations such as **PUT, GET, DELETE, and RESET** while observing changes in cache order, hits, misses, evictions, and hit rate.

---

## Overview

LRU Cache is a commonly used caching strategy in computer systems where the item that has been used least recently is removed when the cache reaches its capacity.

Understanding the internal working of an LRU Cache can be difficult when it is explained only through code or theory.

This project aims to make the concept easier to understand through an **interactive visual interface**.

Users can perform cache operations and immediately see how the cache changes.

---

## Features

- Interactive LRU Cache interface
- Configure cache capacity
- Add items using `PUT`
- Access items using `GET`
- Remove items using `DELETE`
- Clear the entire cache using `RESET`
- Visual representation of cache order
- **MRU (Most Recently Used)** and **LRU (Least Recently Used)** indicators
- Cache hit counter
- Cache miss counter
- Eviction counter
- Automatic hit-rate calculation
- Operation history
- Data-structure explanation panel
- Responsive modern UI
- Hover animations and visual feedback

---

## How LRU Cache Works

The cache maintains items according to their recent usage.

For example, with a cache capacity of `4`:

```text
MRU                         LRU
 ↓                           ↓

[A] ⇄ [B] ⇄ [C] ⇄ [D]
