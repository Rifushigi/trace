import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../common/animations/app_animations.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  double _dragStartX = 0;
  double _dragStartY = 0;

  final List<OnboardingPage> _pages = [
    OnboardingPage(
      title: 'Welcome to Trace',
      description:
          'Track attendance with ease using facial recognition technology.',
      image: 'assets/images/onboarding_1.png',
    ),
    OnboardingPage(
      title: 'Smart Attendance',
      description:
          'Automatically mark attendance using our advanced AI system.',
      image: 'assets/images/onboarding_2.png',
    ),
    OnboardingPage(
      title: 'Real-time Reports',
      description: 'Get instant access to attendance reports and analytics.',
      image: 'assets/images/onboarding_3.png',
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _completeOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('has_seen_onboarding', true);
    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/sign-in');
    }
  }

  void _handleVerticalSwipe(DragUpdateDetails details) {
    // Swipe up to skip onboarding
    if (details.primaryDelta! < -50) {
      _completeOnboarding();
    }
  }

  void _handleHorizontalSwipe(DragUpdateDetails details) {
    // Swipe right to go back
    if (details.primaryDelta! > 50 && _currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
    // Swipe left to go next
    else if (details.primaryDelta! < -50 && _currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GestureDetector(
        onVerticalDragStart: (details) {
          _dragStartY = details.globalPosition.dy;
        },
        onVerticalDragUpdate: (details) {
          final delta = details.globalPosition.dy - _dragStartY;
          if (delta.abs() > 50) {
            _handleVerticalSwipe(details);
          }
        },
        onHorizontalDragStart: (details) {
          _dragStartX = details.globalPosition.dx;
        },
        onHorizontalDragUpdate: (details) {
          final delta = details.globalPosition.dx - _dragStartX;
          if (delta.abs() > 50) {
            _handleHorizontalSwipe(details);
          }
        },
        child: Stack(
          children: [
            // Background with animated container
            AppAnimations.animatedContainer(
              context: context,
              duration: const Duration(milliseconds: 800),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Theme.of(context).primaryColor.withAlpha(25),
                      Theme.of(context).scaffoldBackgroundColor,
                    ],
                  ),
                ),
              ),
            ),
            PageView.builder(
              controller: _pageController,
              itemCount: _pages.length,
              onPageChanged: (index) {
                setState(() {
                  _currentPage = index;
                });
              },
              itemBuilder: (context, index) {
                return _OnboardingPageView(page: _pages[index]);
              },
            ),
            // Skip button with bounce and pulse animation
            Positioned(
              top: MediaQuery.of(context).padding.top + 16,
              right: 16,
              child: AppAnimations.pulse(
                child: AppAnimations.bounceIn(
                  duration: const Duration(milliseconds: 800),
                  child: TextButton(
                    onPressed: _completeOnboarding,
                    child: const Text('Skip'),
                  ),
                ),
              ),
            ),
            // Gesture hint overlay
            Positioned(
              bottom: 120,
              left: 0,
              right: 0,
              child: AppAnimations.fadeIn(
                child: Center(
                  child: Text(
                    'Swipe up to skip • Swipe left/right to navigate',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Theme.of(context)
                              .textTheme
                              .bodySmall
                              ?.color
                              ?.withAlpha(179),
                        ),
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 48,
              left: 0,
              right: 0,
              child: Column(
                children: [
                  // Page indicators with staggered animation
                  AppAnimations.staggeredList(
                    children: List.generate(
                      _pages.length,
                      (index) => _PageIndicator(
                        isActive: index == _currentPage,
                      ),
                    ),
                    itemDuration: const Duration(milliseconds: 400),
                    staggerDuration: const Duration(milliseconds: 100),
                  ),
                  const SizedBox(height: 32),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        if (_currentPage > 0)
                          AppAnimations.combinedAnimation(
                            useFlip: true,
                            useScale: false,
                            child: TextButton(
                              onPressed: () {
                                _pageController.previousPage(
                                  duration: const Duration(milliseconds: 300),
                                  curve: Curves.easeInOut,
                                );
                              },
                              child: const Text('Previous'),
                            ),
                          )
                        else
                          const SizedBox.shrink(),
                        AppAnimations.combinedAnimation(
                          useFlip: true,
                          useRotate: true,
                          child: ElevatedButton(
                            onPressed: _currentPage == _pages.length - 1
                                ? _completeOnboarding
                                : () {
                                    _pageController.nextPage(
                                      duration:
                                          const Duration(milliseconds: 300),
                                      curve: Curves.easeInOut,
                                    );
                                  },
                            child: Text(
                              _currentPage == _pages.length - 1
                                  ? 'Get Started'
                                  : 'Next',
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OnboardingPageView extends StatelessWidget {
  final OnboardingPage page;

  const _OnboardingPageView({required this.page});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Image with hero and combined animation
          AppAnimations.hero(
            tag: 'onboarding_image_${page.title}',
            child: AppAnimations.combinedAnimation(
              useFlip: true,
              duration: const Duration(milliseconds: 800),
              child: Image.asset(
                page.image,
                height: 300,
              ),
            ),
          ),
          const SizedBox(height: 32),
          // Title with combined animation
          AppAnimations.combinedAnimation(
            useScale: true,
            useRotate: true,
            useFlip: false,
            duration: const Duration(milliseconds: 600),
            child: Text(
              page.title,
              style: Theme.of(context).textTheme.headlineMedium,
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 16),
          // Description with shimmer effect
          AppAnimations.shimmer(
            child: AppAnimations.combinedAnimation(
              useScale: false,
              useRotate: false,
              useFlip: false,
              duration: const Duration(milliseconds: 600),
              child: Text(
                page.description,
                style: Theme.of(context).textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PageIndicator extends StatelessWidget {
  final bool isActive;

  const _PageIndicator({required this.isActive});

  @override
  Widget build(BuildContext context) {
    return AppAnimations.pulse(
      duration: const Duration(milliseconds: 1000),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        width: 8,
        height: 8,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: isActive
              ? Theme.of(context).primaryColor
              : Theme.of(context).primaryColor.withAlpha(77),
        ),
      ),
    );
  }
}

class OnboardingPage {
  final String title;
  final String description;
  final String image;

  OnboardingPage({
    required this.title,
    required this.description,
    required this.image,
  });
}
