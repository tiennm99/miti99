---
title: "Newsletter #88"
date: 2026-03-13
tags: ["AI-Assisted"]
categories: ["Newsletter"]
---

*Mời bạn thưởng thức Newsletter #88.*

## [A Broken Heart](https://allenpike.com/2026/a-broken-heart/)

Allen Pike chia sẻ một câu chuyện debug thú vị khi dashboard của ứng dụng web đột nhiên chậm đi 10 lần - từ 1 giây lên 10 giây. Sau khi loại trừ React (vốn bị nghi ngờ đầu tiên), anh phát hiện ra Safari đang dành 94% CPU cho... Layout?

Bằng phương pháp binary search với sự hỗ trợ của Claude, anh tìm ra thủ phạm: một emoji trái tim ❤️ trong nút "Send Feedback". Hóa ra font **Noto Color Emoji** của Google - được sử dụng để render emoji nhất quán trên các nền tảng - gây ra bug nghiêm trọng trong Safari, khiến mỗi lần layout mất 1600ms thay vì 2ms bình thường.

Điều thú vị là bug này chỉ ảnh hưởng một số emoji cụ thể (❤️, 🤯) trong khi các emoji khác (🧺, 🫠) vẫn render nhanh bình thường. Giải pháp tạm thời: liệt kê "Apple Color Emoji" trước Noto Color Emoji trong font-family.

**Điểm chính:**
- Font Noto Color Emoji sử dụng COLRv1 spec, fallback sang SVG trên Safari
- Bug nằm trong CoreSVG của Apple, đã được báo cáo cho WebKit team
- Coding agent giúp tạo minimal repro case nhanh hơn nhiều so với thủ công
- Câu chuyện thú vị về cách AI vừa là nguyên nhân (gợi ý dùng font này) vừa là giải pháp (giúp debug)

## [Wrapping Code Comments](https://matklad.github.io/2026/02/21/wrapping-code-comments.html)

Một bài viết ngắn nhưng thú vị từ matklad về việc wrap code và comments. Tác giả nhận ra rằng code và comments nên được wrap ở độ rộng khác nhau: code ở khoảng 100 cột (để vừa 2 editor cạnh nhau), nhưng nội dung comments nên wrap ở 60-70 cột để dễ đọc hơn.

Điều quan trọng là comments nên wrap **tương đối** so với vị trí bắt đầu của comment, không phải tuyệt đối. Ví dụ: comment ở top-level có thể rộng, nhưng comment lồng sâu trong code nên hẹp hơn nhưng vẫn giữ độ rộng nội dung giống nhau.

**Điểm chính:**
- Giới hạn code ở 100 cột, nội dung comments ở 60-70 cột
- Comments nên wrap tương đối theo vị trí, không tuyệt đối
- VS Code và Emacs đều không hỗ trợ tốt relative wrapping
- Soft-wrapping không thể wrap đúng nếu không hiểu ý nghĩa text (ví dụ markdown lists)

## [How I Use Claude Code](https://boristane.com/blog/how-i-use-claude-code/)

Boris Tane chia sẻ workflow 9 tháng sử dụng Claude Code với nguyên tắc cốt lõi: **không bao giờ để Claude viết code cho đến khi đã review và approve plan**. Workflow gồm 3 phase:

**Phase 1 - Research:** Yêu cầu Claude đọc sâu codebase và viết báo cáo vào `research.md`. Từ khóa quan trọng: "deeply", "in great details", "intricacies" - để Claude không chỉ đọc hời hợt.

**Phase 2 - Planning:** Tạo `plan.md` chi tiết, sau đó thêm inline notes để sửa, reject approaches, thêm constraints. Chu trình annotation này lặp 1-6 lần với guard "don't implement yet".

**Phase 3 - Implementation:** Khi plan đã sẵn sàng, một prompt duy nhất: "implement it all. mark completed in plan. don't stop until done."

**Điểm chính:**
- File markdown là shared mutable state giữa human và AI
- Annotation cycle inject domain knowledge mà Claude không có
- Single long session tốt hơn split sessions - context được build dần
- Implementation nên boring - creative work đã xong ở planning phase
- "I want implementation to be boring" - tất cả decisions đã được validate

### Bonus

**Images:**
![RabbitMQ vs Kafka vs Pulsar](https://substackcdn.com/image/fetch/$s_!h2M_!,w_1100,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1d6d88ea-4355-4f29-96fa-9770907beebb_2360x2960.png)
![REST vs GraphQL](https://substackcdn.com/image/fetch/$s_!8P-v!,w_1100,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F6039d506-e02f-4313-ab97-2c04f8c94d90_2360x2960.png)
![Eventual Consistency in Modern Databases](https://substackcdn.com/image/fetch/$s_!yela!,w_1100,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5ac3310f-e380-48c2-93ff-051f7606b533_2250x2624.png)
![Strong Consistency In Databases](https://substackcdn.com/image/fetch/$s_!vB9v!,w_1100,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbc02c74f-e91f-438a-8ad8-d5ba6831e7f0_2250x2624.png)
![PostgreSQL versus MySQL](https://substackcdn.com/image/fetch/$s_!h8d0!,w_1100,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc5f67fe5-0efa-4fc6-98da-d176b60b1a92_2508x3000.jpeg)
![Network Protocols Explained](https://substackcdn.com/image/fetch/$s_!_roW!,w_1100,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdbdb9cae-3bda-4a62-9077-3f9d1e13fede_2360x2960.jpeg)

**Videos:**
[Video: What Is Redis Really About? - ByteByteGo](https://www.youtube.com/watch?v=z_NbVtbgBJw)
