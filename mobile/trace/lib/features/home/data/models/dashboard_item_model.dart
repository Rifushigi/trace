import '../../domain/entities/dashboard_item.dart';

class DashboardItemModel {
  final String title;
  final String route;
  final String icon;
  final String description;

  DashboardItemModel({
    required this.title,
    required this.route,
    required this.icon,
    required this.description,
  });

  factory DashboardItemModel.fromJson(Map<String, dynamic> json) {
    return DashboardItemModel(
      title: json['title'] as String,
      route: json['route'] as String,
      icon: json['icon'] as String,
      description: json['description'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'route': route,
      'icon': icon,
      'description': description,
    };
  }

  DashboardItem toEntity() {
    return DashboardItem(
      title: title,
      route: route,
      icon: icon,
      description: description,
    );
  }
}
