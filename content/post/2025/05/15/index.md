---
title: "Newsletter #28"
date: 2025-05-15
tags: [ "AI-Assisted", "Java", "Machine Learning", "Build Automation", "Development" ]
categories: [ "Newsletter" ]
---

*Mời bạn thưởng thức Newsletter #28.*

## [How Airbnb Measures Listing Lifetime Value](https://medium.com/airbnb-engineering/how-airbnb-measures-listing-lifetime-value-a603bf05142c)

Bài viết từ Airbnb Engineering chia sẻ cách họ đo lường và tính toán Listing Lifetime Value (LTV) - một metric quan trọng để hiểu giá trị kinh tế dài hạn của mỗi listing trên nền tảng. Đây là một bài viết kỹ thuật chi tiết về cách xây dựng hệ thống đo lường metrics phức tạp trong môi trường production quy mô lớn.

Airbnb đã phát triển một framework toàn diện để đo lường LTV của listings, bao gồm việc xử lý các thách thức như:

**Các thách thức chính:**

- **Tính toán giá trị dự đoán**: Làm thế nào để dự đoán lifetime value của một listing khi chưa biết được nó sẽ hoạt động trong bao lâu
- **Xử lý dữ liệu thời gian thực**: Cập nhật metric này khi có booking mới, cancellation, hay thay đổi giá
- **Tính toán trên quy mô lớn**: Xử lý hàng triệu listings với hàng tỷ data points

**Kiến trúc kỹ thuật:**

- Sử dụng data pipeline để xử lý streaming data
- Áp dụng machine learning models để dự đoán behavior patterns
- Implement caching strategies để đảm bảo performance
- Thiết kế hệ thống monitoring và alerting cho data quality

Bài viết cũng đề cập đến việc balance giữa accuracy và computational cost, cách handle edge cases, và làm thế nào để validate kết quả của model trong môi trường thực tế.

## [Six JDK 24 Features You Should Know About](https://foojay.io/today/six-jdk-24-features-you-should-know-about/)

Bài viết từ foojay.io giới thiệu 6 tính năng quan trọng nhất trong JDK 24, phiên bản Java được phát hành vào tháng 3/2025 với tổng cộng 24 JEP (JDK Enhancement Proposals) - số lượng tính năng mới lớn nhất kể từ khi áp dụng lịch phát hành 6 tháng một lần.

**Các tính năng nổi bật:**

### 1. JEP 483: Ahead-of-time Class Loading & Linking

- Thuộc về Project Leyden nhằm giảm startup time của Java applications
- Cho phép classes được load và link sẵn khi JVM khởi động, tránh overhead của việc loading/verifying/linking lặp đi lặp lại
- Cải thiện đáng kể thời gian khởi động ứng dụng

### 2. JEP 485: Stream Gatherers

- Mở rộng Streams API với khả năng tạo custom intermediate operations
- Tương tự như Collector interface cho terminal operations, Gatherer interface cho phép developers tạo các custom intermediate operations
- Tăng tính linh hoạt và khả năng tái sử dụng trong functional programming

### 3. JEP 491: Synchronize Virtual Threads Without Pinning

- Giải quyết limitation quan trọng của virtual threads khi sử dụng synchronized blocks/methods
- Trước đây, virtual threads sẽ "pin" platform thread khi trong synchronized block, giờ monitor được associate với virtual thread thay vì platform thread
- Cải thiện đáng kể scalability của applications sử dụng virtual threads

### 4. JEP 486: Permanently Disable Security Manager

- Loại bỏ hoàn toàn Security Manager - tính năng đã deprecated từ JDK 17
- Mặc dù có vẻ giảm security, thực tế Security Manager đã lỗi thời và ít được sử dụng
- Applications sử dụng tính năng này sẽ cần architectural changes để migrate lên JDK 24

### 5. JEP 498: Warning for sun.misc.Unsafe Memory-Access Methods

- JVM sẽ warning khi sử dụng memory-access methods trong sun.misc.Unsafe
- Khuyến khích chuyển sang sử dụng VarHandle API và Foreign Function & Memory API
- Tiếp tục quá trình encapsulation của internal JDK APIs

### 6. JEP 501: Deprecate 32-bit x86 Port for Removal

- Deprecate 32-bit x86 port trên Linux (Windows 32-bit đã bị remove từ JDK 21)
- Phản ánh thực tế là rất ít hệ thống vẫn chạy 32-bit OS trong môi trường production hiện đại

## [JavaOne 2025: Function and Memory Access in Pure Java](https://www.infoq.com/news/2025/04/foreign-function-minborg/)

Bài viết từ InfoQ tóm tắt bài presentation của Per-Åke Minborg tại JavaOne 2025 về Foreign Function & Memory API (FFM), một trong những tính năng quan trọng nhất được giới thiệu trong JDK 22. FFM API được phát triển dưới dự án Panama nhằm thay thế JNI (Java Native Interface) với cách tiếp cận hiện đại và an toàn hơn.

**Vấn đề với JNI truyền thống:**

- Native-first programming model dễ bị lỗi với sự kết hợp giữa Java và C
- Chi phí maintain và deploy cao
- Passing data to/from JNI cumbersome và inefficient
- Chỉ support primitive types và Java objects
- Không có cách nào để deterministically free memory
- Limited addressing space (~2GB)

**Foreign Memory API - Giải pháp cho memory access:**

### Memory Segments và Arena

- `MemorySegment` interface cung cấp access đến continuous memory region với 64-bit addressing
- Control thông qua Size (Out-Of-Bounds protection), Lifetime (Use-After-Free protection), và Thread Confinement
- `Arena` interface quản lý lifecycle của native memory segments với các types:
  - **Global**: unbounded lifetime
  - **Auto**: automatic garbage-collected lifetime
  - **Confined**: explicitly bounded lifetime
  - **Shared**: explicitly bounded lifetime với multi-threaded access

### Value Layouts và VarHandle

- `ValueLayout` interface model values của basic data types với 3 attributes: Carrier Type, Endianness, Alignment
- Sử dụng để obtain `VarHandle` instances từ `MemorySegment`
- `MemoryLayout` interface mô tả memory segment contents một cách structured, giúp tránh manual offset computation

**Foreign Function API - Interop với native libraries:**

### jextract Tool

- Tool tự động generate Java bindings từ native library headers
- Built upon FFM API, giúp mechanical generation thay vì manual coding
- Ví dụ: call native quick sort function trực tiếp từ Java code

**Benefits của FFM API:**

- **Safe và efficient access** đến native memory với deterministic deallocation
- **Direct và efficient access** đến native functions - 100% Java, không cần maintain native code
- **Foundation for Project Panama** interoperability với tooling như jextract để generate layouts và handles

Đây là bước tiến quan trọng trong việc modernize Java's native interop capabilities, mang lại performance tốt hơn và developer experience được cải thiện đáng kể so với JNI truyền thống.

## [Ultimate Guide to Project Reactor, Thread-Locals and Context Propagation](https://4comprehension.com/ultimate-guide-to-project-reactor-thread-locals-and-context-propagation/)

Bài viết toàn diện từ 4comprehension.com giải thích chi tiết về một trong những thách thức phức tạp nhất khi làm việc với Project Reactor: context propagation và thread-local variables. Đây là vấn đề thường gặp trong reactive programming khi tasks có thể "nhảy" giữa các threads khác nhau, dẫn đến mất context quan trọng.

**Vấn đề cốt lõi:**
Trong traditional threading model, `ThreadLocal` variables hoạt động như một `Map<Thread, Value>` - mỗi thread có storage riêng biệt. Tuy nhiên trong reactive streams, execution có thể chuyển đổi giữa nhiều threads thông qua các operators như `publishOn()`, khiến ThreadLocal values bị mất.

**Các giải pháp được trình bày:**

### 1. Reactor's Context API

- Sử dụng `contextWrite()` để lưu trữ context values
- Truy cập context thông qua `Mono.deferContextual()` trong `flatMap()`
- Context được propagate tự động qua reactive chain

### 2. Integration với ThreadLocal-based Tools

- Giải quyết vấn đề với Mapped Diagnostic Context (MDC) logging
- Sử dụng execute-around pattern để restore ThreadLocal values
- Tạo utility methods để giảm boilerplate code

### 3. Accessing Context từ `doOnNext()`

- Sử dụng `doOnEach()` thay vì `doOnNext()` để access context
- Check signal type và extract context từ `Signal` object
- Tạo wrapper methods cho clean code

### 4. Automatic Context Propagation

- Enable với `Hooks.enableAutomaticContextPropagation()`
- Register custom `ThreadLocalAccessor` cho automatic restoration
- Trade-off giữa convenience và performance overhead

**Key takeaways:**

- Context propagation là challenge quan trọng trong reactive programming
- Multiple approaches tùy thuộc vào use case cụ thể
- Manual context management cho control tốt hơn, automatic approach cho convenience
- Cần careful analysis để chọn approach phù hợp với performance requirements

## [JDK 24 G1/Parallel/Serial GC Changes](https://tschatzl.github.io/2025/04/01/jdk24-g1-serial-parallel-gc-changes.html)

Bài viết từ Thomas Schatzl (Oracle) tổng hợp những thay đổi quan trọng trong các garbage collectors của JDK 24. Mặc dù JDK 24 không có nhiều thay đổi breakthrough trong GC area, nhưng có những cải tiến đáng chú ý và roadmap hứa hẹn cho JDK 25.

**Parallel GC:**

- Loại bỏ một số synchronization không cần thiết trong evacuation loop (JDK-8269870)
- Có thể giảm pause times trong một số tình huống cụ thể
- Tập trung vào optimization cho hot path trong garbage collection

**Serial GC:**

- Tiếp tục công việc cleanup và refactoring code base
- Cải thiện maintainability và code quality
- Chuẩn bị cho những thay đổi lớn hơn trong tương lai

**G1 GC - Những cải tiến quan trọng:**

### 1. Predictor Values Optimization (JDK-8343189)

G1 sử dụng predictions để đạt được pause time goals, bao gồm cost của memory copying và reference updates. Trước đây, G1 sử dụng pre-baked values được xác định từ lâu trên máy SPARC "lớn" và không được update. Những values này rất conservative, khiến G1 mất khoảng 30 garbage collections để adapt với environment hiện tại.

Thay đổi mới cho phép actual values ghi đè trực tiếp pre-baked predictor values thay vì cộng dồn, giúp G1 adapt nhanh hơn với application và environment. Trade-off là có thể có nhiều pause time overshoots trong những garbage collections đầu tiên.

### 2. Young Generation Remembered Sets Optimization (JDK-8336086)

- G1 giờ quản lý remembered sets cho toàn bộ young generation như một single unit
- Loại bỏ duplicates và tiết kiệm memory đáng kể
- Giảm số lượng remembered set entries, từ đó giảm nhẹ garbage collection pauses
- Kế thừa ý tưởng từ JDK 23 với những cải tiến bổ sung

**Roadmap JDK 25 - Những thay đổi lớn sắp tới:**

### Write Barrier Overhaul

- Một trong những thay đổi lớn nhất từ trước đến nay trong interaction giữa application và G1
- Write barriers được thực thi cho mọi reference write có impact lớn đến application throughput
- Dự kiến cải thiện throughput lên đến 10%, pause times ngắn hơn, code generation tốt hơn
- Đang được chuẩn bị thành JEP để integrate trong những tháng tới

### Old Generation Remembered Sets Merging (JDK-8343782)

- Mở rộng ý tưởng merging remembered sets cho old generation regions
- Tiết kiệm native memory còn lớn hơn nữa
- Đã được integrate trong JDK 25

**Các discussions và projects đang diễn ra:**

- **Automatic Heap Sizing**: Project mang tính năng tương tự ZGC đến stop-the-world collectors (đóng góp từ Microsoft và Google)
- **G1 as True Default Collector**: Thảo luận về việc làm G1 thành default collector thay vì Serial GC trong môi trường nhỏ, vì G1 đang cho thấy performance tương đương hoặc tốt hơn Serial GC trong hầu hết metrics

JDK 24 tập trung vào foundation improvements và optimization, đặt nền móng cho những breakthrough lớn hơn trong JDK 25, đặc biệt là write barrier overhaul hứa hẹn mang lại performance gains đáng kể.

## [Making Makefiles for fun and profit](https://dev.to/aws/making-makefiles-for-fun-and-profit-kl6)

Bài viết từ AWS Developer Advocate Darko Mesaroš khám phá lại Makefiles - công cụ build automation 48 tuổi nhưng vẫn cực kỳ hữu ích trong development workflows hiện đại. Mặc dù Make được tạo ra từ năm 1976 để giải quyết vấn đề quên compile files trong development, ngày nay nó có thể làm được nhiều hơn thế rất nhiều.

**Tại sao Makefiles vẫn relevant:**

- **Tự động hóa các task lặp đi lặp lại**: Thay vì nhớ các commands phức tạp, chỉ cần `make deploy` hoặc `make clean`
- **Dependency management thông minh**: Chỉ rebuild những parts thực sự cần thiết
- **Standardization**: Tạo consistent workflows cho team development
- **Cross-platform compatibility**: Hoạt động trên Unix, Linux, macOS và Windows

**Các use cases thực tế được trình bày:**

### 1. Terraform Automation

- Tự động switching environments và workspace management
- Safety checks trước khi chạy `terraform destroy` với warnings đầy đủ
- Environment variable management cho different deployment targets

### 2. Local Development Environment Setup

- Automated Docker container spinning cho databases (Postgres, Redis)
- Dynamic password generation và environment file creation
- Cargo lambda development với proper environment variable injection
- One-command setup cho complex development stacks

### 3. AWS CDK Projects

- Multi-language build automation (TypeScript + Rust)
- Separate deployment commands cho individual stacks vs. complete deployment
- Local testing environment với DynamoDB Local integration
- Comprehensive cleanup commands

### 4. Static Website Deployment

- Automated S3 upload với proper content-type headers
- AWS Amplify deployment triggering
- Dynamic AWS resource ID resolution

**Modern approach với AI assistance:**

Bài viết showcase cách sử dụng Amazon Q Developer CLI để generate sophisticated Makefiles without cần phải master Make's byzantine syntax. AI tool có thể:

- Tự động detect project structure và generate appropriate targets
- Dynamic resource ID resolution (như Amplify app IDs)
- Environment-specific configuration management
- Best practices implementation cho different project types

**Key takeaways cho developers:**

- Makefiles không chỉ dành cho C programming - chúng powerful cho bất kỳ automation workflow nào
- Modern AI tools giúp overcome learning curve của Make syntax
- Investment vào Makefile setup pays off long-term trong team productivity
- Always remember `.PHONY` targets để avoid conflicts với actual files

Đây là reminder tuyệt vời rằng sometimes old tools are still the best tools, đặc biệt khi được enhance bởi modern AI assistance để lower barrier to entry.

## [Improving Pinterest Search Relevance Using Large Language Models](https://medium.com/pinterest-engineering/improving-pinterest-search-relevance-using-large-language-models-4cd938d4e892)

Bài viết từ Pinterest Engineering team chia sẻ về journey cải thiện search relevance trên platform bằng cách integrate Large Language Models vào search infrastructure. Đây là case study thực tế về việc apply LLMs trong production search systems quy mô lớn với hàng tỷ Pins và hàng triệu user queries mỗi ngày.

**Challenges trong Pinterest Search:**

Pinterest search có những đặc thù riêng biệt so với traditional text search engines. Users thường search bằng visual concepts, aesthetic preferences, và contextual intentions mà khó express bằng keywords đơn giản. Ví dụ, query "cozy living room" có thể có hàng trăm interpretations khác nhau về color schemes, furniture styles, và ambiance.

**LLM Integration Strategy:**

### 1. Query Understanding Enhancement

- **Semantic Query Expansion**: LLMs giúp hiểu deeper intent đằng sau user queries, expanding "minimalist bedroom" thành related concepts như "clean lines", "neutral colors", "simple furniture"
- **Contextual Interpretation**: Xử lý ambiguous queries bằng cách leverage user's previous interactions và browsing history
- **Multi-modal Understanding**: Combine text queries với visual context để improve relevance

### 2. Content Representation Improvement

- **Rich Pin Embeddings**: Generate comprehensive embeddings cho Pins bằng cách combine visual features với textual descriptions được enhance bởi LLMs
- **Dynamic Content Tagging**: Automatically generate relevant tags và categories cho user-generated content
- **Quality Assessment**: Use LLMs để evaluate content quality và filter out low-relevance results

### 3. Ranking Model Enhancement

- **Feature Engineering**: LLMs generate additional features cho ranking models, including semantic similarity scores và content quality indicators
- **Real-time Personalization**: Adapt search results based on user preferences được inferred từ LLM analysis
- **Diversity Optimization**: Ensure search results maintain diversity while improving relevance

**Technical Implementation:**

### Architecture Design

- **Hybrid Approach**: Combine traditional search algorithms với LLM-powered enhancements
- **Scalability Considerations**: Efficient LLM inference để handle millions of queries per day
- **Latency Optimization**: Balance between LLM processing time và user experience requirements

### Model Training và Fine-tuning

- **Domain-specific Training**: Fine-tune LLMs trên Pinterest-specific data including user behavior patterns và content characteristics
- **Continuous Learning**: Implement feedback loops để continuously improve model performance
- **A/B Testing Framework**: Rigorous testing methodology để measure impact của LLM improvements

**Results và Impact:**

- **Search Relevance Metrics**: Significant improvements trong click-through rates, user engagement, và search satisfaction scores
- **User Experience**: Reduced search abandonment rates và increased time spent exploring search results
- **Business Impact**: Improved user retention và increased platform engagement

**Key Learnings:**

- **Model Complexity vs. Performance**: Finding right balance giữa model sophistication và practical implementation constraints
- **Data Quality Importance**: High-quality training data crucial cho LLM effectiveness trong search applications
- **Human-in-the-loop**: Importance của human evaluation và feedback trong LLM-powered search systems
- **Iterative Improvement**: Search relevance improvement là continuous process requiring ongoing optimization

Đây là example tuyệt vời về cách major tech platforms leverage LLMs để solve real-world problems, demonstrating practical applications của AI trong improving user experience at scale.
