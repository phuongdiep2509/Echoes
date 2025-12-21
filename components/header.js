// Header JavaScript - Chức năng tìm kiếm và các function khác
(function() {
  // Chức năng tìm kiếm cho header
  window.searchFunctions = {
    // Toggle search box
    toggleSearch: function() {
      const container = document.getElementById('searchContainer');
      const input = document.getElementById('searchInput');
      
      if (container && container.classList.contains('show')) {
        container.classList.remove('show');
      } else if (container) {
        container.classList.add('show');
        if (input) input.focus();
      }
    },

    // Perform search với dữ liệu cứng để test
    performSearch: function(query) {
      const resultsContainer = document.getElementById('searchResults');
      
      if (!resultsContainer) return;
      
      if (!query || query.trim().length < 2) {
        resultsContainer.innerHTML = '<div class="no-results">Nhập ít nhất 2 ký tự để tìm kiếm...</div>';
        return;
      }

      // Dữ liệu mẫu cứng để test
      const sampleData = {
        concerts: {
          "anh-trai-say-hi-2025": {
            title: "ANH TRAI SAY HI 2025 CONCERT",
            venue: "Khu đô thị Vạn Phúc",
            genre: "Concert",
            date: "27/12/2025",
            time: "12:00",
            tickets: { vip: { price: 10000000 }, standard: { price: 5000000 } }
          },
          "YConcert": {
            title: "Y CONCERT 2025",
            venue: "Vinhomes Ocean Park 3",
            genre: "Concert",
            date: "20/12/2026",
            time: "14:00",
            tickets: { vip: { price: 5000000 }, standard: { price: 3000000 } }
          },
          "mr-siro-concert": {
            title: "Ai Cũng Giấu Trong Lòng Tảng Băng",
            venue: "Nhà Hát Quân Đội Phía Nam",
            genre: "Concert",
            date: "10/01/2025",
            time: "19:00",
            tickets: { vip: { price: 2800000 }, standard: { price: 1200000 } }
          }
        },
        liveMusic: {
          "concert-bon-canh-chim-troi": {
            title: "BỐN CÁNH CHIM TRỜI",
            venue: "Nhà hát Lớn Hà Nội",
            genre: "Live Music",
            date: "27/12/2025",
            time: "20:00",
            tickets: { vip: { price: 800000 }, standard: { price: 500000 } }
          },
          "a-tale-of-two-christmas": {
            title: "A TALE OF TWO CHRISTMAS",
            venue: "Rock Club, TP.HCM",
            genre: "Live Music",
            date: "29/12/2025",
            time: "21:30",
            tickets: { vip: { price: 800000 }, standard: { price: 500000 } }
          }
        },
        merchandise: {
          "ao-thun-echoes": {
            name: "Áo thun Echoes",
            description: "Áo thun chính hãng Echoes với chất liệu cotton cao cấp",
            price: 299000
          },
          "mu-snapback": {
            name: "Mũ Snapback Echoes",
            description: "Mũ snapback thời trang với logo Echoes",
            price: 199000
          }
        }
      };

      // Sử dụng dữ liệu mẫu hoặc dữ liệu đã load
      const dataToSearch = window.ObjectForEchoes || sampleData;
      this.searchInData(query, resultsContainer, dataToSearch);
    },

    // Search in loaded data với thuật toán fuzzy search
    searchInData: function(query, resultsContainer, dataSource) {
      const searchTerm = query.toLowerCase().trim();
      const searchWords = searchTerm.split(' ').filter(word => word.length > 0);
      let results = [];

      try {
        // Sử dụng dataSource được truyền vào hoặc window.ObjectForEchoes
        const data = dataSource || window.ObjectForEchoes;
        if (!data) {
          resultsContainer.innerHTML = '<div class="no-results">Không có dữ liệu để tìm kiếm</div>';
          return;
        }

        const { concerts, liveMusic, merchandise } = data;

        // Hàm tính điểm tương đồng đơn giản
        const calculateScore = (text, searchWords) => {
          if (!text) return 0;
          const textLower = text.toLowerCase();
          let score = 0;
          
          searchWords.forEach(word => {
            if (textLower.includes(word)) {
              score += word.length * 10; // Điểm cơ bản
              if (textLower.startsWith(word)) {
                score += 20; // Bonus nếu bắt đầu bằng từ khóa
              }
            }
          });
          
          return score;
        };

        // Tìm kiếm trong concerts
        if (concerts) {
          Object.entries(concerts).forEach(([key, concert]) => {
            let totalScore = 0;
            totalScore += calculateScore(concert.title, searchWords) * 3;
            totalScore += calculateScore(concert.venue, searchWords) * 2;
            totalScore += calculateScore(concert.genre, searchWords);
            
            if (totalScore > 0) {
              results.push({
                type: 'concert',
                data: concert,
                id: key,
                score: totalScore
              });
            }
          });
        }

        // Tìm kiếm trong live music
        if (liveMusic) {
          Object.entries(liveMusic).forEach(([key, music]) => {
            let totalScore = 0;
            totalScore += calculateScore(music.title, searchWords) * 3;
            totalScore += calculateScore(music.venue, searchWords) * 2;
            totalScore += calculateScore(music.genre, searchWords);
            
            if (totalScore > 0) {
              results.push({
                type: 'music',
                data: music,
                id: key,
                score: totalScore
              });
            }
          });
        }

        // Tìm kiếm trong merchandise
        if (merchandise) {
          Object.entries(merchandise).forEach(([key, item]) => {
            let totalScore = 0;
            totalScore += calculateScore(item.name, searchWords) * 3;
            totalScore += calculateScore(item.description, searchWords);
            
            if (totalScore > 0) {
              results.push({
                type: 'merchandise',
                data: item,
                id: key,
                score: totalScore
              });
            }
          });
        }

        // Sắp xếp theo điểm số
        results.sort((a, b) => b.score - a.score);

        this.displaySearchResults(results, resultsContainer, searchWords);
        
      } catch (error) {
        console.error('Lỗi tìm kiếm:', error);
        resultsContainer.innerHTML = '<div class="no-results">Có lỗi xảy ra khi tìm kiếm: ' + error.message + '</div>';
      }
    },

    // Load data and search (fallback)
    loadDataAndSearch: function(query, resultsContainer) {
      resultsContainer.innerHTML = '<div class="no-results">Đang tải dữ liệu...</div>';
      
      // Thử load dữ liệu bằng dynamic import
      import('../scripts/ObjectForEchoes.js')
        .then(module => {
          console.log('Loaded module:', module); // Debug log
          
          // Lưu dữ liệu vào window để sử dụng lần sau
          window.ObjectForEchoes = {
            concerts: module.concerts || {},
            liveMusic: module.liveMusic || {},
            merchandise: module.merchandise || {}
          };
          
          console.log('ObjectForEchoes loaded:', window.ObjectForEchoes); // Debug log
          
          this.searchInData(query, resultsContainer);
        })
        .catch(error => {
          console.error('Lỗi load dữ liệu:', error);
          // Fallback: thử load bằng cách khác
          this.loadDataWithFetch(query, resultsContainer);
        });
    },

    // Alternative loading method with fetch
    loadDataWithFetch: function(query, resultsContainer) {
      // Tạo dữ liệu mẫu để test
      window.ObjectForEchoes = {
        concerts: {
          "anh-trai-say-hi-2025": {
            title: "ANH TRAI SAY HI 2025 CONCERT",
            venue: "Khu đô thị Vạn Phúc",
            genre: "Concert",
            date: "27/12/2025",
            time: "12:00",
            tickets: {
              vip: { price: 10000000 },
              standard: { price: 5000000 },
              economy: { price: 1000000 }
            }
          },
          "YConcert": {
            title: "Y CONCERT 2025",
            venue: "Vinhomes Ocean Park 3",
            genre: "Concert",
            date: "20/12/2026",
            time: "14:00",
            tickets: {
              vip: { price: 5000000 },
              standard: { price: 3000000 },
              economy: { price: 1000000 }
            }
          }
        },
        liveMusic: {
          "concert-bon-canh-chim-troi": {
            title: "BỐN CÁNH CHIM TRỜI",
            venue: "Nhà hát Lớn Hà Nội",
            genre: "Live Music",
            date: "27/12/2025",
            time: "20:00",
            tickets: {
              vip: { price: 800000 },
              standard: { price: 500000 }
            }
          }
        },
        merchandise: {
          "ao-thun-echoes": {
            name: "Áo thun Echoes",
            description: "Áo thun chính hãng Echoes",
            price: 299000
          }
        }
      };
      
      console.log('Fallback data loaded:', window.ObjectForEchoes); // Debug log
      this.searchInData(query, resultsContainer);
    },

    // Display search results với highlight
    displaySearchResults: function(results, resultsContainer, searchWords) {
      if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">Không tìm thấy kết quả nào</div>';
        return;
      }

      // Hàm highlight từ khóa đơn giản
      const highlightText = (text, searchWords) => {
        if (!text || !searchWords) return text;
        let highlightedText = text;
        searchWords.forEach(word => {
          const regex = new RegExp(`(${word})`, 'gi');
          highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });
        return highlightedText;
      };

      let html = '';
      
      // Nhóm kết quả theo loại
      const concerts = results.filter(r => r.type === 'concert');
      const music = results.filter(r => r.type === 'music');
      const merchandise = results.filter(r => r.type === 'merchandise');

      // Hiển thị concerts
      if (concerts.length > 0) {
        html += '<div class="search-category">🎵 CONCERT ÂM NHẠC</div>';
        concerts.slice(0, 3).forEach(item => {
          const concert = item.data;
          let priceText = 'Liên hệ';
          
          if (concert.tickets) {
            const prices = Object.values(concert.tickets).map(t => t.price).filter(p => p > 0);
            if (prices.length > 0) {
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);
              priceText = `${minPrice.toLocaleString()}đ - ${maxPrice.toLocaleString()}đ`;
            }
          }
          
          html += `
            <div class="search-item" onclick="window.searchFunctions.goToEvent('concertDetail.html?id=${item.id}')">
              <div class="search-item-title">${highlightText(concert.title, searchWords)}</div>
              <div class="search-item-info">
                📍 ${highlightText(concert.venue, searchWords)} • 📅 ${concert.date} ${concert.time}
              </div>
              <div class="search-item-price">${priceText}</div>
            </div>
          `;
        });
      }

      // Hiển thị live music
      if (music.length > 0) {
        html += '<div class="search-category">🎤 NHẠC SỐNG</div>';
        music.slice(0, 3).forEach(item => {
          const musicEvent = item.data;
          let priceText = 'Liên hệ';
          
          if (musicEvent.tickets) {
            const prices = Object.values(musicEvent.tickets).map(t => t.price).filter(p => p > 0);
            if (prices.length > 0) {
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);
              priceText = `${minPrice.toLocaleString()}đ - ${maxPrice.toLocaleString()}đ`;
            }
          }
          
          html += `
            <div class="search-item" onclick="window.searchFunctions.goToEvent('musicDetail.html?id=${item.id}&type=live-music')">
              <div class="search-item-title">${highlightText(musicEvent.title, searchWords)}</div>
              <div class="search-item-info">
                📍 ${highlightText(musicEvent.venue, searchWords)} • 📅 ${musicEvent.date} ${musicEvent.time}
              </div>
              <div class="search-item-price">${priceText}</div>
            </div>
          `;
        });
      }

      // Hiển thị merchandise
      if (merchandise.length > 0) {
        html += '<div class="search-category">🛍️ MERCHANDISE</div>';
        merchandise.slice(0, 3).forEach(item => {
          const product = item.data;
          
          html += `
            <div class="search-item" onclick="window.searchFunctions.goToEvent('merchandiseDetail.html?id=${item.id}')">
              <div class="search-item-title">${highlightText(product.name, searchWords)}</div>
              <div class="search-item-info">${highlightText(product.description, searchWords)}</div>
              <div class="search-item-price">${product.price.toLocaleString()}đ</div>
            </div>
          `;
        });
      }

      resultsContainer.innerHTML = html;
    },

    // Navigate to event
    goToEvent: function(url) {
      window.location.href = url;
    }
  };

  // Global functions for onclick handlers
  window.toggleSearch = function() {
    window.searchFunctions.toggleSearch();
  };

  window.performSearch = function(query) {
    window.searchFunctions.performSearch(query);
  };

  // Close search when clicking outside
  document.addEventListener('click', function(e) {
    const searchBox = document.querySelector('.search-box');
    const container = document.getElementById('searchContainer');
    
    if (searchBox && container && !searchBox.contains(e.target)) {
      container.classList.remove('show');
    }
  });

  // Add CSS variables
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--color-red', '#74070d');
    document.documentElement.style.setProperty('--color-green', '#46462a');
    document.documentElement.style.setProperty('--color-beige', '#f0efeb');
  }
})();