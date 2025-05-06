import 'package:flutter/material.dart';

class RefreshWrapper extends StatelessWidget {
  final Widget child;
  final Future<void> Function() onRefresh;
  final Color? refreshColor;
  final Color? backgroundColor;
  final double displacement;
  final double edgeOffset;

  const RefreshWrapper({
    Key? key,
    required this.child,
    required this.onRefresh,
    this.refreshColor,
    this.backgroundColor,
    this.displacement = 40.0,
    this.edgeOffset = 0.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      color: refreshColor ?? Theme.of(context).primaryColor,
      backgroundColor: backgroundColor ?? Theme.of(context).scaffoldBackgroundColor,
      displacement: displacement,
      edgeOffset: edgeOffset,
      child: child,
    );
  }
}

class RefreshableListView extends StatelessWidget {
  final List<Widget> children;
  final Future<void> Function() onRefresh;
  final EdgeInsets? padding;
  final ScrollController? controller;
  final bool shrinkWrap;
  final ScrollPhysics? physics;
  final Color? refreshColor;
  final Color? backgroundColor;

  const RefreshableListView({
    Key? key,
    required this.children,
    required this.onRefresh,
    this.padding,
    this.controller,
    this.shrinkWrap = false,
    this.physics,
    this.refreshColor,
    this.backgroundColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return RefreshWrapper(
      onRefresh: onRefresh,
      refreshColor: refreshColor,
      backgroundColor: backgroundColor,
      child: ListView(
        controller: controller,
        padding: padding,
        shrinkWrap: shrinkWrap,
        physics: physics,
        children: children,
      ),
    );
  }
}

class RefreshableGridView extends StatelessWidget {
  final List<Widget> children;
  final Future<void> Function() onRefresh;
  final EdgeInsets? padding;
  final ScrollController? controller;
  final bool shrinkWrap;
  final ScrollPhysics? physics;
  final int crossAxisCount;
  final double mainAxisSpacing;
  final double crossAxisSpacing;
  final Color? refreshColor;
  final Color? backgroundColor;

  const RefreshableGridView({
    Key? key,
    required this.children,
    required this.onRefresh,
    this.padding,
    this.controller,
    this.shrinkWrap = false,
    this.physics,
    this.crossAxisCount = 2,
    this.mainAxisSpacing = 8.0,
    this.crossAxisSpacing = 8.0,
    this.refreshColor,
    this.backgroundColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return RefreshWrapper(
      onRefresh: onRefresh,
      refreshColor: refreshColor,
      backgroundColor: backgroundColor,
      child: GridView.count(
        controller: controller,
        padding: padding,
        shrinkWrap: shrinkWrap,
        physics: physics,
        crossAxisCount: crossAxisCount,
        mainAxisSpacing: mainAxisSpacing,
        crossAxisSpacing: crossAxisSpacing,
        children: children,
      ),
    );
  }
} 